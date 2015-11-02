# Color API endpoints
Color  = require '../src/color'
Redis  = require '../src/redis'
logger = require '../src/logger'

# Creates a new color and inserts in redis
#
# POST /api/v1/colors
#
# @example Sample request body
#   { "color": "00adeb,983897" }
#
# @example Sample response body
#   { "id": "colorpicker:1" }
#
exports.create = (req, res) ->
  Color.create(req.body['color'])
    .then (response) ->
      res.json id: response
    .fail (err) ->
      res.status 422
      res.json error: err.toString()
    .catch (err) =>
      res.status 500
      res.json error: err

# Gets a list of all existing colors in redis
#
# GET /api/v1/colors
#
# @example Sample response body
#   [ { 'colorpicker:424': '00ffff,ffff00' }, { 'colorpicker:423': '00adeb,983897' } ]
#
exports.index = (req, res) ->
  Color.index()
    .then (response) ->
      res.json response
    .fail (err) ->
      res.status 422
      res.json error: err.toString()
    .catch (err) =>
      res.status 500
      res.json error: err

# Deletes an existing color from redis
#
# DELETE /api/v1/colors/:id
#
# @example Sample response body
#   { "success": true }
#
exports.destroy = (req, res) ->
  Color.destroy(req.param('id'))
    .then (response) ->
      res.json success: true
    .fail (err) ->
      res.status 422
      res.json error: err.toString()
    .catch (err) =>
      res.status 500
      res.json error: err
