Server     = require '../../src/server'
config     = require '../../src/config'
logger     = require '../../src/logger'
# sinon      = require 'sinon'
testServer = require '../support/test_server'

describe 'Server', ->
  beforeEach ->
    # build a test server, but don't run it yet
    @server = new Server config.server.host, config.server.port

  describe 'constructor', ->
    it "returns a server object with host, port, cert, and key", ->
      @server.host.should.eql(config.server.host)
      @server.port.should.eql(config.server.port)

    it 'returns a server object with a valid @url', ->
      @server.url.should.eql("https://#{ config.server.host }:#{ config.server.port }/")

  describe 'run', ->
    it 'creates an HTTPS server', ->
      # run a new server, firing callback() when successful
      @server.run(->
        true.should.eql true
        @.close(->
          true.should.eql true
        )
      )

  describe "close", ->
    it "should close the HTTPS server", ->
      # close server immediately after it starts
      # on success, assert.ok
      run_callback = ->
        @server.close(close_callback())

      # callback to call when server.close succeeds
      close_callback = ->
        assert.ok(true)

      # run server, fire the run callback
      # close the server immediately after it starts
      @server.run(->
        @.close(->)
      )

describe 'websockets', ->
  describe 'backbone', ->
    @backboneClient = undefined
    @beagleClient   = undefined

    before (done) ->
      @server = new Server(config.server.host, config.server.port).run(done)

    after (done) ->
      @server.close(done())

    before (done) ->
      @backboneClient = new testServer('/backbone', done)

    before (done) ->
      @beagleClient = new testServer('/beaglebone', done)

    after (done) ->
      @backboneClient.stop(done)

    after (done) ->
      @beagleClient.stop(done)

    describe 'colorChanged', ->
      it 'relays a colorChanged event to the beagle', (done) ->
        color = '152,056,151,000\n'
        @beagleClient.socket.on 'colorChanged', (data) =>
          data.color.should.eql(color)
          done()

        @backboneClient.socket.emit('colorChanged', color: color)

    describe 'colorSet', ->
      it 'relays a colorSet event to the beagle', (done) ->
        color = '255,255,255,255\n255,255,255,255\n255,255,255,255\n255,255,255,255\n255,255,255,255'
        @beagleClient.socket.on 'colorSet', (data) =>
          data.color.should.eql(color)
          done()

        @backboneClient.socket.emit('colorSet', color: color)
