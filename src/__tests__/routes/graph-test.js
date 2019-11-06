const request = require('supertest')
const moxios = require('moxios')

const express = require('express')
const app = express()

const statisticalProgramExample = require('../test-data/statisticalProgramExample')
const statisticalProgramExampleGraph = require('../test-data/statisticalProgramExampleGraph')
const statisticalProgramExampleFilteredGraph = require('../test-data/statisticalProgramExampleFilteredGraph')
const statisticalProgramSkatt = require('../test-data/statisticalProgramSkatt')
const statisticalProgramSkattGraph = require('../test-data/statisticalProgramSkattGraph')
const statisticalProgramSkattDataGraph = require('../test-data/statisticalProgramSkattDataGraph')

app.use('/api/graph', require('../../routes/graph')())

describe('Test /api/graph endpoints', () => {

  beforeEach(() => {
    moxios.install()
  })
  afterEach(() => {
    moxios.uninstall()
  })

  test('It should return a graph of statistical program dummy example', async () => {
    moxios.stubRequest('http://mock/graphql', {
      status: 200,
      response: statisticalProgramExample
    })
    await request(app).get('/api/graph/statisticalProgram/dummyId').expect(200, statisticalProgramExampleGraph)
  })

  test('It should return a graph of statistical program tax example', async () => {
    moxios.stubRequest('http://mock/graphql', {
      status: 200,
      response: statisticalProgramSkatt
    })
    await request(app).get('/api/graph/statisticalProgram/dummyId').expect(200, statisticalProgramSkattGraph)
  })

  test('It should return a dataset graph of statistical program tax example', async () => {
    moxios.stubRequest('http://mock/graphql', {
      status: 200,
      response: statisticalProgramSkatt
    })
    await request(app).get('/api/graph/statisticalProgram/dummyId?filter=UnitDataset').expect(200, statisticalProgramSkattDataGraph)
  })

  test('It should return a dataset graph of filtered types', async () => {
    moxios.stubRequest('http://mock/graphql', {
      status: 200,
      response: statisticalProgramExample
    })
    await request(app).get('/api/graph/statisticalProgram/dummyId?filter=BusinessProcess,ProcessStep').expect(200, statisticalProgramExampleFilteredGraph)
  })

  test('It should return 404 not found', async () => {
    moxios.stubRequest('http://mock/graphql', {
      status: 404,
      response: { message: 'invalid data' }
    });
    await request(app).get('/api/graph/statisticalProgram/XX').expect(404, "invalid data");
  })


  test('It should return 404 on error', async () => {
    moxios.stubRequest('http://mock/graphql', {
      status: 200,
      response: {
        "errors": [
          {
            "message": "Cannot return null for non-nullable type: 'StatisticalProgram' within parent 'Query' (/StatisticalProgramById)",
            "path": [
              "StatisticalProgramById"
            ]
          }
        ],
        "data": null
      }
    })
    await request(app).get('/api/graph/statisticalProgram/XX').expect(404);
  })

})


