Http    = require 'http'
Socket  = require 'socket.io'
FS      = require 'fs'
express = require 'express'
exphbs  = require 'express3-handlebars'
colors  = require '../routes/colors'
manager = require '../routes/manager'
logger  = require './logger'

class Server
  beagles:   []
  backbones: []

  # set up the express application, including assets, routes and middlewares
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

    # express middlewares
    @app.use express.json()
    @app.use express.urlencoded()
    @app.use express.methodOverride()
    @app.use @app.router
    @app.use express.bodyParser()

    # routes
    @app.get '/', (request, response, next) -> response.render 'index'

    @app.post   "#{@options['api_namespace']}/colors",     colors.create
    @app.get    "#{@options['api_namespace']}/colors",     colors.index
    @app.delete "#{@options['api_namespace']}/colors/:id", colors.destroy

    @app.get "#{@options['api_namespace']}/manager/off", manager.off.bind(null, @beagles)
    @app.get "#{@options['api_namespace']}/manager/random",  manager.random.bind(null, @beagles)

  # stop the server, firing callback upon success
  close: (callback) ->
    @httpServer.close(callback)

  run: (callback) ->
    @port = process.env.PORT || @port

    logger.info "starting colorpicker server at #{ @host }:#{ @port }"
    @httpServer = Http.createServer(@app).listen(@port, @host, callback);
    @_sio_configure_listener(@httpServer)
    return @httpServer

  # sets up the socket.io sockets and namespaces
  # @note
  #   colorChanged and colorSet both writeColorDataToFile in our
  #   beaglebone client node app. backbone.js takes care of sending
  #   5x1 color, or 5 individual colors
  _sio_configure_listener: (app) ->
    logger.info "Configuring socket.io listener"
    sio = Socket.listen app,
      'logger'   : logger,
      'log level': logger.level

    @_sio_listen_to_backbone sio
    @_sio_listen_to_beaglebone sio

  _sio_listen_to_backbone: (sio) ->
    # when backbone.js Client runs `io.connect('http://localhost:1337/backbone')`
    sio.of('/backbone').on 'connection', (socket) =>
      logger.info "/backbone client connected"
      @backbones.push socket

      # when Client is live-previewing color
      socket.on 'colorChanged', (data) =>
        # send colorChanged data to all beagles
        beagle.emit('colorChanged', { color: data.color }) for beagle in @beagles # where beagle is connected

      # when Client picks a new color
      socket.on 'colorSet', (data) =>
        # send colorSet data to all @beagles
        beagle.emit('colorSet', { color: data.color }) for beagle in @beagles

  _sio_listen_to_beaglebone: (sio) ->
    # when beaglebone Client runs `io.connect('http://localhost:1337/beaglebone')`
    # push them into the @beagles array
    sio.of('/beaglebone').on 'connection', (socket) =>
      logger.info "/beaglebone client connected"
      @beagles.push socket

      # remove beaglebone client from @beagles array
      # if disconnection event occurs
      socket.on 'disconnect', (socket) =>
        logger.info "/beaglebone client disconnected"
        @beagles.pop socket

module.exports = Server
