const router = require('express').Router()

const addRequestId = require('express-request-id')()
const logger = require('morgan')
const loggerFormat = ':id [:date[web]] ":method :url" :status :response-time'

module.exports = () => {

  const datamodelController = require('../controllers')().datamodel

  // Set up request log and its associated response log to have the same id
  router.use(addRequestId)

  logger.token('id', function getId (req) {
    return req.id
  })

  router.use(logger(loggerFormat, {
    skip: function (req, res) {
      return res.statusCode < 400
    },
    stream: process.stderr
  }))

  router.use(logger(loggerFormat, {
    skip: function (req, res) {
      return res.statusCode >= 400
    },
    stream: process.stdout
  }))

  router.get('/statisticalProgram/:id', datamodelController.getStatisticalProgram)
  router.get('/statisticalProgram/:id/:cycle', datamodelController.getStatisticalProgramCycle)
  return router
}