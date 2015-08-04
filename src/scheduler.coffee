Q = require 'q'
request = require 'request'

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
    return deferred.promise

module.exports = Scheduler

# if process.ENV['scheduler'] == 'true'
  # Scheduler.run()
