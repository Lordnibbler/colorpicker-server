ioClient = require 'socket.io-client'
config   = require '../../src/config'
io       = null

class TestServer
  constructor: (@namespace, @cb) ->
    # start a new test server
    @socket = undefined
    @start(@namespace, @cb)

  start: (namespace, cb) ->
    # vars
    socketURL = "#{config.server.host}:#{config.server.port}#{namespace}"
    options =
      transports: ['websockets']
      'force new connection': true

    # need to provide instance-level access to our
    # @socket so we can emit events to be tested
    @socket = ioClient.connect(socketURL, options)

    @socket.on "connect", (data) =>
      cb() if cb

  stop: (cb) ->
    @socket.disconnect()
    cb() if cb

module.exports = TestServer
