Server     = require '../../src/server'
config     = require 'config'
logger     = require '../../src/logger'
testServer = require '../support/test_server'

describe 'Server', ->
  before ->
    # build a test server, but don't run it yet
    @server = new Server config.server.host, config.server.port

  describe 'constructor', ->
    it "returns a server object with host, port, cert, and key", ->
      @server.host.should.eql(config.server.host)
      @server.port.should.eql(config.server.port)

    it 'returns a server object with a valid @url', ->
      @server.url.should.eql("https://#{ config.server.host }:#{ config.server.port }/")

  describe 'run', ->
    it 'creates an HTTPS server', (done) ->
      # run a new server, firing callback() when successful
      @server.run(->
        true.should.eql true
        @.close(->
          true.should.eql true
          done()
        )
      )

  describe "close", ->
    it "should close the HTTPS server", (done) ->
      # run server, fire the run callback
      # close the server immediately after it starts
      @server.run(->
        @.close(done())
      )

  describe '_sio_configure_listener', ->
    before (done) ->
      # fire up a Node.js server
      @server = new Server(config.server.host, config.server.port)
      @server.run(done)

      # ensure our beagles/backbones arrays are empty
      @server.beagles.length.should.eql 0
      @server.backbones.length.should.eql 0

    after (done) ->
      @server.close(done())

    before (done) ->
      cb = =>
        # ensure our backbone socket was pushed into the backbones array
        @server.backbones.length.should.eql 1
        done()

      # connect a test backbone client to the /backbone namespace
      @backboneClient = new testServer('/backbone', cb)

    after (done) ->
      @backboneClient.stop(done)

    before (done) ->
      # connect a test beaglebone client to the /beaglebone namespace
      cb = =>
        # ensure our beagle socket was pushed into the beagles array
        @server.beagles.length.should.eql 1
        done()

      # connect a test backbone client to the /backbone namespace
      @beagleClient = new testServer('/beaglebone', cb)

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
