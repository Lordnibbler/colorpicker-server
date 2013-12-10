Http    = require 'http'
Socket  = require 'socket.io'
logger  = require './logger'
FS      = require 'fs'
express = require 'express'
path    = require 'path'
clients = []

class Server
  constructor: (@host, @port, @options = {}) ->
    @url = "https://#{ @host }:#{ @port }/"
    @app = express()
    @app.use express.static(__dirname + "/../public")

  close: (callback) ->
    @httpServer.close(callback)

  run: (callback) ->
    if process.env.PORT?
      @port = process.env.PORT

    @httpServer = Http.createServer(@app).listen(@port, @host, callback);
    @_sio_configure_listener(@httpServer)

  _sio_configure_listener: (app) ->
    sio = Socket.listen app,
      'logger'   : logger,
      'log level': logger.level

    logger.info "Configuring socket.io listener"

    # when Client user runs `io.connect()`
    sio.sockets.on 'connection', (socket) ->
      logger.info "CLIENT CONNECTED"
      clients.push socket

      # when Client is live-previewing color
      socket.on 'colorChanged', (data) ->
        c.emit('colorChangedBeagleBone', { color: data.color }) for c in clients

      # when Client picks a new color
      socket.on 'colorSet', (data) ->
        c.emit('colorChangedBeagleBone', { color: data.color }) for c in clients

module.exports = Server
