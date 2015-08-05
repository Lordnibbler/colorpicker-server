Q = require 'q'
request = require 'request'
Redis = require './redis'

# checks time and sets lights via HTTP API calls
# if sunrise, turns off lights. if sunset turns on lights.
# manager allows turning lights on and off
# @note this might be better named Manager, as scheduler pertains to the Heroku worker
#   scheduled task
class Scheduler
  # scheduler job entrypoint, which checks if sunset or sunrise
  # and accordingly turns the lights on or off
  # @run:  ->
    # @off()
    # return if @_check_sunrise()
    # return if @_check_sunset()

  # @_check_sunset: ->

  # emits solid black over all connected beagle sockets
  @off: (sockets) ->
    # console.log 'scheduler off'
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

  # picks a random color from redis and emits over socket
  @on: (sockets) ->
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

  # @param hex [String] 'fffccc'
  @hexToRgb: (hex) ->
    bigint = parseInt(hex, 16)
    r = (bigint >> 16) & 255
    g = (bigint >> 8) & 255
    b = bigint & 255
    return { r: r , g: g, b: b }


module.exports = Scheduler

# if process.ENV['scheduler'] == 'true'
  # Scheduler.run()
