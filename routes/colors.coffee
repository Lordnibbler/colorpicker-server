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
      .then ->
        res.json success: true
      .fail (message) ->
        res.status 422
        res.json error: message
      .catch (err) =>
        res.status 500
        res.json error: err
