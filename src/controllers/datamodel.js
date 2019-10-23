const post = require('axios').post
const env = process.env.NODE_ENV
const properties = require('../properties')[env]
const getStatisticalProgramById = require('../query/getStatisticalProgramById')
const graphqlPrinter = require('graphql/language/printer').print

const humanizeGraphQLResponse = require('../util/graphQL')
const nodeType = {
  BUSINESS_PROCESS: 'BusinessProcess',
  PROCESS_STEP: 'ProcessStep',
  CODE_BLOCK: 'CodeBlock',
  UNIT_DATASET: 'UnitDataset'
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
  function getHeaders(req) {
    return {
      "authorization": req.headers["authorization"] || "",
    };
  }


  /* istanbul ignore next */
  function handleError (res) {
    return (error) => {
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
    const obj = humanizeGraphQLResponse(model).data.StatisticalProgramById.statisticalProgramCycles[0]
    let result = { nodes: [], edges: [] }
    addToResult(null, obj, result, nodeType.BUSINESS_PROCESS)
    return result
  }

  function createNode (obj, type) {
    // TODO: Use language code
    return { id: obj.id, label: obj.name[0].languageText, type: type }
  }

  function createCodeBlock (obj) {
    return { id: obj.id, label: obj.codeBlockTitle || 'Kode blokk', type: nodeType.CODE_BLOCK }
  }

  function createEdge (from, to) {
    return { from: from.id, to: to.id }
  }

  function addToResult (parent, obj, result, type) {
    try {
      if (type === nodeType.CODE_BLOCK ) {
        obj.id = parent.id + obj.codeBlockIndex
        result.nodes.push(createCodeBlock(obj))
      } else {
        result.nodes.push(createNode(obj, type))
      }
      if (parent) {
        result.edges.push(createEdge(parent, obj))
      }
      // Reverse direction
      if (obj['previousBusinessProcess']) {
        const prev = obj['previousBusinessProcess']
        result.nodes.push(createNode(prev, nodeType.BUSINESS_PROCESS))
        result.edges.push(createEdge(prev, obj))
      }
      if (obj['businessProcesses']) {
        const bp = obj['businessProcesses']
        bp.forEach(e => {
          addToResult(obj, e, result, nodeType.BUSINESS_PROCESS)
        })
      }
      if (obj['processSteps']) {
        const ps = obj['processSteps']
        ps.forEach(e => {
          addToResult(obj, e, result, nodeType.PROCESS_STEP)
        })
      }

      if (obj['codeBlocks']) {
        const cb = obj['codeBlocks']
        cb.forEach(e => {
          addToResult(obj, e, result, nodeType.CODE_BLOCK)
        })
      }
      if (obj['processStepInstance']) {
        if (obj['processStepInstance']['transformedOutputs']) {
          const cb = obj['processStepInstance']['transformedOutputs']
          cb.forEach(e => {
            addToResult(obj, e, result, nodeType.UNIT_DATASET)
          })
        }
        // Reverse direction
        if (obj['processStepInstance']['transformableInputs']) {
          const ti = obj['processStepInstance']['transformableInputs']
          ti.forEach(e => {
            result.nodes.push(createNode(e, nodeType.UNIT_DATASET))
            result.edges.push(createEdge(e, obj))
          })
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  return {
    getStatisticalProgram (req, res) {
      let url = getUrl(req.query.lds)
      return post(url + 'graphql', {
        query: graphqlPrinter(getStatisticalProgramById),
        variables: { id: req.id }
      }, {headers: getHeaders(req)})
        .then((response) => {
          if (response.data.data) {
            res.status(response.status).send(mapProcessGraph(response.data.data))
          } else {
            res.status(404).send('Data not found for: ' + req.id)
          }
        })
        .catch(handleError(res))
    },
  }

}