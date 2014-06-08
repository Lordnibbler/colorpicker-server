Http      = require 'http'
Socket    = require 'socket.io'
logger    = require './logger'
FS        = require 'fs'
express   = require 'express'
path      = require 'path'
exphbs    = require 'express3-handlebars'
beagles   = []
backbones = []

class Server
  # set up the express application, including assets, routes and middlewares
  #
  constructor: (@host, @port, @options = {}) ->
    @url = "https://#{ @host }:#{ @port }/"
    @app = express()

    # use basic HTTP auth if production
    if process.env.NODE_ENV == 'production'
      auth = express.basicAuth(process.env.USERNAME || 'foo', process.env.PASSWORD || 'bar')
      @app.use('/', auth)

      # Set the default layout and locate layouts and partials
      @app.engine('handlebars', exphbs(
        defaultLayout: 'main',
        layoutsDir: 'dist/views/layouts/',
        partialsDir: 'dist/views/partials/'
      ))

      # Locate the views
      @app.set('views', __dirname + '/../dist/views')

      # Locate the assets
      @app.use(express.static(__dirname + '/../dist/assets'))
    else
      # Default Layout and locate layouts and partials
      @app.engine('handlebars', exphbs(
        defaultLayout: 'main',
        layoutsDir: 'views/layouts/',
        partialsDir: 'views/partials/'
      ))

      # Locate the views
      @app.set('views', __dirname + '/../views')

      # Locate the assets
      @app.use(express.static(__dirname + '/../assets'))

    # Set Handlebars
    @app.set 'view engine', 'handlebars'

    # routes
    @app.get '/', (request, response, next) ->
      response.render 'index'


  # stop the server, firing callback upon success
  #
  close: (callback) ->
    @httpServer.close(callback)

  run: (callback) ->
    @port = process.env.PORT if process.env.PORT?

    logger.info "starting colorpicker server at #{ @host }:#{ @port }"
    @httpServer = Http.createServer(@app).listen(@port, @host, callback);
    @_sio_configure_listener(@httpServer)
    return @httpServer

  # sets up the socket.io sockets and namespaces
  # @note
  #   colorChanged and colorSet both writeColorDataToFile in our
  #   beaglebone client node app. backbone.js takes care of sending
  #   5x1 color, or 5 individual colors
  #
  _sio_configure_listener: (app) ->
    sio = Socket.listen app,
      'logger'   : logger,
      'log level': logger.level

    # sio.configure ->
    #   sio.set "transports", ["xhr-polling", "jsonp-polling", "htmlfile"]

    logger.info "Configuring socket.io listener"

    # when backbone.js Client runs `io.connect('http://localhost:1337/backbone')`
    sio.of('/backbone').on('connection', (socket) ->
      logger.info "/backbone CLIENT CONNECTED"
      backbones.push socket

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
