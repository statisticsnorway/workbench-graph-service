const post = require('axios').post
const env = process.env.NODE_ENV
const properties = require('../properties')[env]
const getStatisticalProgramById = require('../query/getStatisticalProgramById')
const graphqlPrinter = require('graphql/language/printer').print

const humanizeGraphQLResponse = require('humanize-graphql-response')

module.exports = function () {

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
  let url = properties.api.lds

  function handleError (res) {
    return (error) => {
      if (error instanceof Error) {
        console.debug('An error has occured: ', error)
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

  return {
    getStatisticalProgram (req, res) {
      let url = getUrl(req.query.lds)
      return post(url + 'graphql', {
        query: graphqlPrinter(getStatisticalProgramById),
        variables: { id: req.id }
      })
        .then((response) => {
          res.status(response.status).send(humanizeGraphQLResponse(response.data))
        })
        .catch(handleError(res))
    },
  }

}