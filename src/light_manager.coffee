Q = require 'q'
request = require 'request'
Redis = require './redis'

# allows turning lights to random color or off
class LightManager
  # emits solid black over all sockets
  @off: (sockets) ->
    deferred = Q.defer()
    for socket in sockets
      socket.emit('colorSet', {
        color:  [
          { r: 0, g: 0, b: 0 },
          { r: 0, g: 0, b: 0 },
          { r: 0, g: 0, b: 0 },
          { r: 0, g: 0, b: 0 },
          { r: 0, g: 0, b: 0 }
        ]
      })
    deferred.resolve({ off: true })
    return deferred.promise

  # picks a random color from redis and emits over all sockets
  @random: (sockets) ->
    deferred = Q.defer()
    Redis.randomkey (result, key) =>
      console.log "got randomKey #{key}"
      Redis.get key, (err, res) =>
        console.log "got key #{key} with value #{res}"

        colors = []
        res.split(',').forEach (el) =>
          colors.push @hexToRgb(el)

        socket.emit('colorSet', color: colors) for socket in sockets

        return deferred.resolve(colors)
    return deferred.promise

  # @param hex [String] a hex color string like '00adeb'
  @hexToRgb: (hex) ->
    bigint = parseInt(hex, 16)
    r = (bigint >> 16) & 255
    g = (bigint >> 8) & 255
    b = bigint & 255
    return { r: r , g: g, b: b }

module.exports = LightManager
