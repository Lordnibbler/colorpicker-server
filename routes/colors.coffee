# Color API endpoints
#
Color = require '../src/color'
Redis = require '../src/redis'

# Creates a new color and inserts in redis
#
# POST /api/v1/colors
#
# @example Sample request body
#   { "color": "00adeb,983897" }
#
# @example Sample response body
#   { "success": true }
#
exports.create = (req, res) ->
  new Color(Redis, 0)
    .create(req.body['color'])
      .then (res) ->
        res.json id: res
      .fail (message) ->
        res.status 422
        res.json error: message
      .catch (err) =>
        res.status 500
        res.json error: err

# Gets a list of all existing colors in redis
#
# GET /api/v1/colors
#
# @example Sample response body
#   [ { 0: '00adeb, 983897' }, { 1: '00ffff, ff0000' } ]
#
exports.index = (req, res) ->
  Color.index()
    .then (res) ->
      res.json res
    .fail (message) ->
      res.status 422
      res.json error: message
    .catch (err) =>
      res.status 500
      res.json error: err
