# Scheduler API endpoints
Scheduler = require '../src/scheduler'
logger    = require '../src/logger'
io        = require 'socket.io'

# turns colorpicker off
#
# GET /api/v1/scheduler/off
exports.off = (sockets, req, res) ->
  Scheduler.off(sockets)
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
# GET /api/v1/scheduler/on
exports.on = (sockets, req, res) ->
  Scheduler.on(sockets)
    .then (response) ->
      res.json response
    .fail (err) ->
      res.status 422
      res.json error: err.toString()
    .catch (err) =>
      res.status 500
      res.json error: err
