Http   = require 'http'
Socket = require 'socket.io'
logger = require './logger'
FS     = require 'fs'

class Server
  constructor: (@host, @port, @options = {}) ->
    @url = "https://#{ @host }:#{ @port }/"

  close: (callback) ->
    @app.close(callback)

  run: (callback) ->
    @app = Http.createServer(@handler).listen(@port, @host, callback)
    @_sio_configure_listener(@app)

  handler: (req, res) ->
    FS.readFile __dirname + "/../index.html", (err, data) ->
      if err
        res.writeHead 500
        return res.end("Error loading index.html")
      res.writeHead 200
      res.end data

  _sio_configure_listener: (app) ->
    sio = Socket.listen app,
      'logger'   : logger,
      'log level': logger.level

    logger.info "Configuring socket.io listener"

    # socket.io global authorization
    # for handshaking when Client tries to connect
    # sio.configure =>
      # sio.set 'authorization', @_sio_authorize

    # when Client user runs `io.connect()`
    sio.sockets.on 'connection', (socket) ->
      logger.info "socket IO server ready, connection callback"

    # when Client is live-previewing color
    sio.sockets.on 'colorChanged', (socket) ->
      logger.info 'colorChanged event emitted'

    # when Client picks a new color
    sio.sockets.on 'colorSet', (socket) ->
      logger.info 'colorSet event emitted'


  _sio_authorize: (handshake, callback) ->
    # if we want to do a global handshaking process
    # for multiple sets of lights

module.exports = Server
