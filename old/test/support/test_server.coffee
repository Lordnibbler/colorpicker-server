ioClient = require 'socket.io-client'
config   = require 'config'

class TestServer
  constructor: (@namespace, @cb) ->
    # start a new test server
    @socket = undefined
    @start(@namespace, @cb)

  start: (namespace, cb) ->
    socketURL = "http://#{config.server.host}:#{config.server.port}#{namespace}"

    # need to provide instance-level access to our
    # @socket so we can emit events to be tested
    console.log 'test server connecting to socketUrl: ', socketURL
    @socket = new ioClient(socketURL, {});

    @socket.on 'connect_error', (object) ->
      console.error 'test server connect error: ', object

    @socket.on 'connect', (data) =>
      console.log 'test server connected'
      cb() if cb

    @socket.on 'error', (obj) ->
      console.error 'test server error: ', obj

  stop: (cb) ->
    @socket.disconnect()
    cb() if cb

module.exports = TestServer
