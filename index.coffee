Fs     = require 'fs'
Server = require './src/server'

loadServer = (host, port) ->
  new Server host, port

module.exports.loadServer = loadServer
