request = require 'supertest'
express = require 'express'
config  = require '../../src/config'
colors  = require '../../routes/colors'
Server  = require '../../src/server'
Color   = require '../../src/color'
Redis   = require '../../src/redis'
server  = undefined

describe '/api/v1/colors Routes', ->
  beforeEach (done) ->
    server = new Server(config.server.host, config.server.port, api_namespace: '/api/v1')
    server.run(done())

  afterEach (done) ->
    server.close(done())

  afterEach (done) ->
    Color.destroy_all().then(done())

  describe 'create', ->
    it 'creates a new color', (done) ->
      request(server.app)
        .post('/api/v1/colors')
        .send({ color: '00adeb,983897' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end( (err, res) ->
          res.body['id'].should.match /colorpicker\:\d/i
          done()
        )

  describe 'index', ->
    keys = []

    before (done) ->
      Color.create('ff0000,0000ff').then (response) ->
        keys.push response
        done()

    before (done) ->
      Color.create('ff0000,0000ff').then (response) ->
        keys.push response
        done()

    it 'gets all keys with the KEY_PREFIX', (done) ->
      request(server.app)
        .get('/api/v1/colors')
        .expect(200)
        .end( (err, res) ->
          # ensure we have more than one color in the response array
          res.body.length.should.be.greaterThan(1)
          Object.keys(res.body).length.should.eql(2)

          # ensure values all equal our hex code
          color[Object.keys(color)[0]].should.eql('ff0000,0000ff') for color in res.body
          done()
        )

  describe 'destroy', ->
    key = undefined

    before (done) ->
      Color.create('ff0000,0000ff').then (response) ->
        key = response
        done()

    it 'destroys a key in redis', (done) ->
      # ensure the key is gone from redis
      cb = ->
        Redis.get key, (err, res) ->
          (res == null).should.eql(true)
          done()

      request(server.app)
        .del("/api/v1/colors/#{key}")
        .expect(200, { success: true }, cb)
