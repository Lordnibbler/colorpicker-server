Server = require '../../src/server'
config = require '../../src/config'

describe 'Server', ->
  beforeEach (done) ->
    # build a test server, but don't run it yet
    @testServer = new Server config.server.host, config.server.port
    done()

  describe "constructor", ->
    it "should return a server object with host, port, cert, and key", ->
      @testServer.host.should.eql(config.server.host)
      @testServer.port.should.eql(config.server.port)

    it 'should return a server object with a valid @url', ->
      @testServer.url.should.eql("https://#{ config.server.host }:#{ config.server.port }/")

  describe "run", ->
    it "should create an HTTPS server", ->
      # run a new server, firing callback() when successful
      @testServer.run(->
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
        @testServer.close(close_callback())

      # callback to call when server.close succeeds
      close_callback = ->
        assert.ok(true)

      # run server, fire the run callback
      # close the server immediately after it starts
      @testServer.run(->
        @.close(->)
      )
