Log    = require 'log'
config = require 'config'

Log::warn = Log::warning # socket.io logger compatibility

module.exports =
  new Log(config?.log?.level or 'info')
