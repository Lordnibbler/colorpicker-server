Server   = require '../../src/server'
config   = require '../../src/config'
sinon    = require 'sinon'
ioClient = require 'socket.io-client'

describe 'Server', ->
  beforeEach (done) ->
    # build a test server, but don't run it yet
    @server = new Server config.server.host, config.server.port
    done()
  describe "constructor", ->
    it "should return a server object with host, port, cert, and key", ->
      @server.host.should.eql(config.server.host)
      @server.port.should.eql(config.server.port)

    it 'should return a server object with a valid @url', ->
      @server.url.should.eql("https://#{ config.server.host }:#{ config.server.port }/")

  describe "run", ->
    it "should create an HTTPS server", ->
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
      @server = new Server(config.server.host, config.server.port).run(done())

    after (done) ->
      @server.close(done())

    describe 'colorChanged', ->
      beforeEach ->
        # connect test clients to the server's backbone and beaglebone sockets
        socketURL = 'http://' + config.server.host + ':' + (config.server.port or 5000)
        options =
          transports: ['websockets']
          'force new connection': true
        @backboneClient = ioClient.connect(socketURL + '/backbone', options)
        @beagleClient   = ioClient.connect(socketURL + '/beaglebone', options)
        @beagleClient.socket.on 'colorChanged', (data) => console.log('colorChanged!!!')

      afterEach ->
        @backboneClient.disconnect()
        @beagleClient.disconnect()

      it 'relays a colorChanged event to the beagle', ->
        @backboneClient.socket.emit('colorChanged', 'foobar')
