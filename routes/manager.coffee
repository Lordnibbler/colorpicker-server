# Light Manager API endpoints
LightManager = require '../src/light_manager'
logger    = require '../src/logger'
io        = require 'socket.io'

# turns colorpicker off
#
# GET /api/v1/manager/off
exports.off = (sockets, req, res) ->
  LightManager.off(sockets)
    .then (response) ->
      res.json response
    .fail (err) ->
      res.status 422
      res.json error: err.toString()
    .catch (err) =>
      res.status 500
      res.json error: err

# turns colorpicker on to a random color
#
# GET /api/v1/manager/random
exports.random = (sockets, req, res) ->
  LightManager.random(sockets)
    .then (response) ->
      res.json response
    .fail (err) ->
      res.status 422
      res.json error: err.toString()
    .catch (err) =>
      res.status 500
      res.json error: err
