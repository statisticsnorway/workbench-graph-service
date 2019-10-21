const request = require('supertest')
const moxios = require('moxios')

const express = require('express')
const app = express()

const statisticalProgram = require('../test-data/statisticalProgram')
//const expectedGraph = {}

app.use('/api/graph', require('../../routes/graph')())

describe('Test /api/graph endpoints', () => {

  beforeEach(() => {
    moxios.install()
  })
  afterEach(() => {
    moxios.uninstall()
  })

  test('It should return a graph of statistical program', async () => {
    moxios.stubRequest('http://mock/graphql', {
      status: 200,
      response: {data: statisticalProgram}
    })
    await request(app).get('/api/graph/statisticalProgram/dummyId').expect(200, statisticalProgram)
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


