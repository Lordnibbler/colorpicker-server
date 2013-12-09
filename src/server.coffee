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
    _this = this
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
      socket.on 'colorChanged', (data) ->
        logger.info 'colorChanged event emitted'
        _this._write_colors_data_to_file(data)

      # when Client picks a new color
      socket.on 'colorSet', (data) ->
        logger.info 'colorSet event emitted'
        _this._write_colors_data_to_file(data)

  _write_colors_data_to_file: (data) ->
    logger.debug JSON.stringify(data, null, 2)

    ws = FS.createWriteStream("#{__dirname}/../colors.txt", {
      flags: "w+"
    })
    ws.write(JSON.stringify(data, null, 2), (err, written) ->
      if err
        throw err
      ws.end()
    )

  _sio_authorize: (handshake, callback) ->
    # if we want to do a global handshaking process
    # for multiple sets of lights

module.exports = Server
