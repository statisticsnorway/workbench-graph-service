const request = require('supertest')

const express = require('express')
const app = express()

app.use('/health', require('../../routes/health')())

describe('Test health endpoints', () => {

  test('It should respond to GET for /alive', () => {
    return request(app).get('/health/alive').expect(200)
  })

  test('It should respond to GET for /ready and hit the LDS-service', () => {
    return request(app).get('/health/ready').expect(200)
  })

})
