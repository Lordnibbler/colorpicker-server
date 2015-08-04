Fs     = require 'fs'
config = require 'config'
Server = require './src/server'
logger = require './src/logger'

logger.debug "Loaded config file"
logger.debug JSON.stringify(config, null, 2)

new Server(config.server.host, config.server.port, { api_namespace: '/api/v1' }).run ->
  logger.info "Express server started on #{config.server.host}:#{config.server.port}"
