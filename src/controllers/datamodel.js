const post = require('axios').post
const env = process.env.NODE_ENV
const properties = require('../properties')[env]
const getStatisticalProgramById = require('../query/getStatisticalProgramById')
const graphqlPrinter = require('graphql/language/printer').print
const _ = require('lodash')

const humanizeGraphQLResponse = require('../util/graphQL')

const GraphMapper = require('../query/graphMapper').GraphMapper
const nodeTypes = require('../query/graphMapper').nodeTypes
const invisible = require('../query/graphMapper').invisible

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
    const obj = humanizeGraphQLResponse(model).StatisticalProgramById[nodeTypes.STATISTICAL_PROGRAM_CYCLE.path][0]
    const mappedTypes = [nodeTypes.BUSINESS_PROCESS, nodeTypes.BUSINESS_PROCESS_REVERSE,
      nodeTypes.BUSINESS_PROCESS_CHILDREN, nodeTypes.PROCESS_STEP, nodeTypes.CODE_BLOCK]
    return new GraphMapper(obj, mappedTypes, nodeTypes.STATISTICAL_PROGRAM_CYCLE.type).graph
  }

  // TODO: Move code into GraphMapper
  function mapDatasetGraph (model) {
    const obj = humanizeGraphQLResponse(model).StatisticalProgramById[nodeTypes.STATISTICAL_PROGRAM_CYCLE.path][0]
    const processSteps = obj.businessProcesses
      .concat(obj.businessProcesses.flatMap(bp => bp.reverseBusinessProcessParentBusinessProcess))
      .filter(nonEmpty('processSteps'))
      .flatMap(bp => bp.processSteps.filter(nonEmpty('codeBlocks')))
    let result = { nodes: [], edges: [] }
    processSteps.reduce((prev, obj) => {
      const inputDS = obj.codeBlocks.filter(nonEmpty('processStepInstance.transformableInputs'))
        .flatMap(toArray('processStepInstance.transformableInputs')).map(ti => ti.inputId)
      const outputDS = obj.codeBlocks.filter(nonEmpty('processStepInstance.transformedOutputs'))
        .flatMap(toArray('processStepInstance.transformedOutputs')).map(ti => ti.outputId)
      inputDS.forEach(input => {
        addNode(createNode(input, nodeTypes.INPUT_DATASET.type), result)
        outputDS.forEach(output => {
          addNode(createNode(output, nodeTypes.OUTPUT_DATASET.type), result)
          result.edges.push(createEdge(input, output))
        })
      })
    }, result)
    return result
  }

  function nonEmpty (path) {
    return function (obj) {
      const arr = _.get(obj, path)
      return arr && arr.length > 0
    }
  }

  function toArray (path) {
    return function (obj) {
      return _.get(obj, path, [])
    }
  }

  function addNode(node, result) {
    // Check to avoid duplicates
    if (!result.nodes.find(e => e.id === node.id)) {
      result.nodes.push(node)
    }
  }

  function createNode (obj, type) {
    // TODO: Use language code
    return { id: obj.id, label: obj.name ? obj.name[0].languageText : 'no name', type: type }
  }

  function createEdge (from, to) {
    return { from: from.id, to: to.id }
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
            if (req.query.filter === 'datasets') {
              res.status(response.status).send(mapDatasetGraph(response.data.data))
            } else {
              res.status(response.status).send(mapProcessGraph(response.data.data))
            }
          } else {
            res.status(404).send('Data not found for: ' + req.params.id)
          }
        })
        .catch(handleError(res))
    },
  }

}