request = require 'supertest'
config  = require '../../src/config'
colors  = require '../../routes/colors'
Server  = require '../../src/server'
server  = undefined

describe '/api/v1/colors Routes', ->
  before (done) ->
    server = new Server(config.server.host, config.server.port, api_namespace: '/api/v1')
    server.run(done())

  after (done) ->
    server.close(done())

  describe 'create', ->
    it 'creates a new color', (done) ->
      request(server.app)
        .post('/api/v1/colors')
        .send({ "color": "00adeb,983897" })
        .expect('Content-Type', /json/)
        .expect(200, {id: "colorpicker:1"}, done)
