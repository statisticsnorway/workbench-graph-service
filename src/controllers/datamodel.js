const post = require('axios').post
const env = process.env.NODE_ENV
const properties = require('../properties')[env]
const getStatisticalProgramById = require('../query/getStatisticalProgramById')
const graphqlPrinter = require('graphql/language/printer').print

const humanizeGraphQLResponse = require('../util/graphQL')
const nodeTypeMap = {
  BUSINESS_PROCESS_REVERSE: { path: 'previousBusinessProcess', type: 'BusinessProcess' , reverse: true},
  BUSINESS_PROCESS: { path: 'businessProcesses', type: 'BusinessProcess' },
  PROCESS_STEP: { path: 'processSteps', type: 'ProcessStep' },
  CODE_BLOCK: { path: 'codeBlocks', type: 'CodeBlock' },
  //INPUT_DATASET: { path: 'processStepInstance.transformableInputs', type: 'UnitDataset', reverse: true},
  //OUTPUT_DATASET: { path: 'processStepInstance.transformedOutputs', type: 'UnitDataset'}
}

module.exports = function () {

  /* istanbul ignore next */
  const getUrl = (lds) => {
    switch (lds) {
      default:
      case 'A':
        return properties.api.ldsA
      case 'B':
        return properties.api.ldsB
      case 'C':
        return properties.api.ldsC
    }
  }

  // Get the authorization header from the request and use this for get authorized access to LDS
  function getHeaders (req) {
    return {
      'authorization': req.headers['authorization'] || '',
    }
  }

  /* istanbul ignore next */
  function handleError (res) {
    return (error) => {
      console.error('Handling error', error)
      if (error instanceof Error) {
        if (error.response && error.response.data) {
          res.status(error.response.status).send(error.response.data.message)
        } else if (error.response) {
          res.status(error.response.status).send(error.response)
        } else {
          res.status(500).send(error)
        }
      } else {
        res.status(400).send(error)
      }
    }
  }

  function mapProcessGraph (model) {
    const obj = humanizeGraphQLResponse(model).StatisticalProgramById.statisticalProgramCycles[0]
    let result = { root: {id: obj.id}, nodes: [], edges: [] }
    addToResult(null, obj, result, 'StatisticalProgramCycle')
    return result
  }

  function mapDatasetGraph (model) {
    const obj = humanizeGraphQLResponse(model).StatisticalProgramById.statisticalProgramCycles[0]
    let result = { root: {id: obj.id}, nodes: [], edges: [] }
    addToResult(null, obj, result, 'StatisticalProgramCycle')
    return result
  }

  function createNode (obj, type) {
    // TODO: Use language code
    return { id: obj.id, label: obj.name ? obj.name[0].languageText : 'no name', type: type }
  }

  function createCodeBlock (obj) {
    return { id: obj.id, label: obj.codeBlockTitle || 'Kode blokk', type: nodeTypeMap.CODE_BLOCK.type }
  }

  function createEdge (from, to) {
    return { from: from.id, to: to.id }
  }

  function addToResult (parent, obj, result, type, reverse = false) {
    try {
      if (type === nodeTypeMap.CODE_BLOCK.type) {
        obj.id = parent.id + obj.codeBlockIndex
        result.nodes.push(createCodeBlock(obj))
      } else {
        result.nodes.push(createNode(obj, type))
      }
      if (parent && reverse) {
        //result.edges.push(createEdge(result.root, obj))
        result.edges.push(createEdge(obj, parent))
      } else if (parent) {
        result.edges.push(createEdge(parent, obj))
      }

      Object.values(nodeTypeMap).forEach(node => {
        if (obj[node.path]) {
          const value = obj[node.path]
          if (Array.isArray(value)) {
            value.forEach(e => {
              addToResult(obj, e, result, node.type, node.reverse)
            })
          } else {
            addToResult(obj, value, result, node.type, node.reverse)
          }
        }
      })
    } catch (e) {
      console.error('Transformation error', e)
    }
  }

  return {
    getStatisticalProgram (req, res) {
      let url = getUrl(req.query.lds)
      return post(url + 'graphql', {
        query: graphqlPrinter(getStatisticalProgramById),
        variables: { id: req.params.id }
      }, { headers: getHeaders(req) })
        .then((response) => {
          if (response.data.data) {
            res.status(response.status).send(mapProcessGraph(response.data.data))
          } else {
            res.status(404).send('Data not found for: ' + req.params.id)
          }
        })
        .catch(handleError(res))
    },
  }

}