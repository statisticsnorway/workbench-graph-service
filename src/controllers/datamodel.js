const post = require('axios').post
const env = process.env.NODE_ENV
const properties = require('../properties')[env]
const getStatisticalProgramById = require('../query/getStatisticalProgramById')
const graphqlPrinter = require('graphql/language/printer').print

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
    const mappedTypes = [nodeTypes.BUSINESS_PROCESS_REVERSE, nodeTypes.BUSINESS_PROCESS, nodeTypes.PROCESS_STEP,
      nodeTypes.CODE_BLOCK]
    return new GraphMapper(obj, mappedTypes, nodeTypes.STATISTICAL_PROGRAM_CYCLE.type).graph
  }

  function hasCodeBlocks (processStep) {
    return processStep.codeBlocks && processStep.codeBlocks.length > 0
  }

  function mapDatasetGraph (model) {
    const obj = humanizeGraphQLResponse(model).StatisticalProgramById[nodeTypes.STATISTICAL_PROGRAM_CYCLE.path][0]
    const processSteps = obj.businessProcesses.flatMap(bp => bp.processSteps.filter(hasCodeBlocks))
    const mappedTypes = [invisible(nodeTypes.CODE_BLOCK), nodeTypes.INPUT_DATASET, nodeTypes.OUTPUT_DATASET]
    return new GraphMapper(processSteps, mappedTypes, nodeTypes.PROCESS_STEP.type).graph
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