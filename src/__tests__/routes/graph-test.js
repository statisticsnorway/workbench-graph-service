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
      response: statisticalProgram
    })
    await request(app).get('/api/graph/statisticalProgram/dummyId').expect(200, statisticalProgram)
  })

})


