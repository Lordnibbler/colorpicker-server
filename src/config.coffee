Fs = require 'fs'

class Config
  constructor: (env) ->
    path   = "#{__dirname}/../config/environments/#{env}.json"
    json   = Fs.readFileSync(path)
    config = JSON.parse(json)

    this[key] = value for key, value of config

module.exports = new Config(process.env.NODE_ENV or "development")
module.exports.Config = Config
