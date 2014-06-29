Fs     = require 'fs'
Server = require './src/server'
config = require './src/config'
logger = require './src/logger'

logger.debug "Loaded config file"
logger.debug JSON.stringify(config, null, 2)

new Server(config.server.host, config.server.port, { api_namespace: 'api/v1' }).run(->
  logger.info "Express server started on #{config.server.host}:#{config.server.port}"
)
