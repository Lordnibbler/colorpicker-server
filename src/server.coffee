Http    = require 'http'
Socket  = require 'socket.io'
logger  = require './logger'
FS      = require 'fs'
express = require 'express'
path    = require 'path'

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

    # socket.io global authorization
    # for handshaking when Client tries to connect
    # sio.configure =>
      # sio.set 'authorization', @_sio_authorize

    save_colors = (data) =>
      @_write_colors_data_to_file(data)

    # when Client user runs `io.connect()`
    sio.sockets.on 'connection', (socket) ->
      # when Client is live-previewing color
      socket.on 'colorChanged', save_colors

      # when Client picks a new color
      socket.on 'colorSet', save_colors

  _write_colors_data_to_file: (data) ->
    logger.debug JSON.stringify(data, null, 2)

    ws = FS.createWriteStream("#{__dirname}/../colors.txt", {
      flags: "w+"
    })
    ws.write(data.color, (err, written) ->
      if err
        throw err
      ws.end()
    )

  _sio_authorize: (handshake, callback) ->
    # if we want to do a global handshaking process
    # for multiple sets of lights

module.exports = Server
