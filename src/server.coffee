Http      = require 'http'
Socket    = require 'socket.io'
logger    = require './logger'
FS        = require 'fs'
express   = require 'express'
path      = require 'path'
beagles   = []
backbones = []

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

    # when backbone.js Client runs `io.connect('http://localhost:1337/backbone')`
    sio.of('/backbone').on('connection', (socket) ->
      logger.info "/backbone CLIENT CONNECTED"
      backbones.push socket

      ######################################
      # colorChanged and colorSet both
      # writeColorDataToFile in our
      # beaglebone client node app.
      # backbone.js takes care of sending
      # all 4x 1 color, or 1x 4 colors
      ######################################

      # when Client is live-previewing color
      socket.on 'colorChanged', (data) ->
        # send colorChanged data to all beagles
        # logger.info "emitting colorChanged to #{beagles.length} beagles"
        beagle.emit('colorChanged', { color: data.color }) for beagle in beagles # where beagle is connected

      # when Client picks a new color
      socket.on 'colorSet', (data) ->
        # send colorSet data to all beagles
        beagle.emit('colorSet', { color: data.color }) for beagle in beagles
    )

    # when beaglebone Client runs `io.connect('http://localhost:1337/beaglebone')`
    # push them into the beagles array
    sio.of('/beaglebone').on('connection', (socket) ->
      logger.info "/beaglebone CLIENT CONNECTED"
      beagles.push socket

      # remove beaglebone client from beagles array
      # if disconnection event occurs
      socket.on('disconnect', (socket) ->
        logger.info "/beaglebone CLIENT DISCONNECTED"
        beagles.pop socket
      )
    )

module.exports = Server
