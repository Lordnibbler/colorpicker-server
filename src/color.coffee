Q     = require 'q'
uuid  = require 'node-uuid'
Redis = require './redis'
KEY_PREFIX = 'colorpicker:'

# represents a Colors collection as a data model in Redis
# @example { 0: '00adeb, 983897' }
#
class Color
  # Creates a new color in the redis cache
  #
  # @param [String] color The comma-delimited hex string of the colors to save to redis
  #
  @create: (color) ->
    # build a Q promise in case redis lags
    deferred = Q.defer()
    deferred.reject('color not provided') if !color

    # generate auto incrementing unique ID
    Redis.incr '0', (err, id) =>
      key = "#{KEY_PREFIX}#{id}"

      # insert new k,v pair
      # TODO use list or set based on the KEY_PREFIX
      Redis.set key, color, (err, res) =>
        return deferred.reject(err) if err

        # Successfully inserted new k/v pair
        return deferred.resolve(key)
    return deferred.promise

  # Class method to return all colors (keys) in Redis
  #
  # @return [Object] all colors from the redis cache
  #
  @index: ->
    # build a Q promise in case redis lags
    deferred = Q.defer()

    # get all redis keys in array
    Redis.keys '*colorpicker*', (err, res) =>
      return deferred.reject(err) if err

      # get value of each key and append to object
      colors = {}
      for key in res
        # preserve the scope of "key" and other bindings with a closure
        do (key, colors) =>
          v = @show(key).then (res) ->
            colors[key] = res
            return deferred.resolve(colors)

    return deferred.promise

  @show: (key) ->
    # build a Q promise in case redis lags
    deferred = Q.defer()

    Redis.get key, (err, res) ->
      return deferred.reject(err) if err
      return deferred.resolve(res)
    return deferred.promise

  @destroy: (key) ->
    # build a Q promise in case redis lags
    deferred = Q.defer()

    Redis.del key, (err, res) ->
      return deferred.reject(err) if err
      return deferred.resolve(res)
    return deferred.promise

  @destroy_all: ->
    # build a Q promise in case redis lags
    deferred = Q.defer()

    Redis.keys '*', (err, res) ->
      for key in res
        Redis.del key, (err, res) ->
          return deferred.reject(err) if err
          return deferred.resolve(res)
    return deferred.promise

module.exports = Color
