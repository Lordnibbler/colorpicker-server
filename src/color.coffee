Q     = require 'q'
uuid  = require 'node-uuid'
Redis = require './redis'
KEY_PREFIX = 'colorpicker:'

# represents a Colors collection as a data model in Redis
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
  # @return [Object] all colors from the redis cache as an object literal
  #   with key being the redis key, and value being the hex string comma delimited
  #
  @index: ->
    # build a Q promise in case redis lags
    deferred = Q.defer()

    # get all redis keys in array
    Redis.keys "*#{KEY_PREFIX}*", (err, keys) =>
      return deferred.reject(err) if err

      # get value of each key and append to object
      #
      colors = []
      for key in keys
        # preserve the scope of "key" and other bindings with a closure
        do (key, colors) =>
          v = @show(key).then (res) ->
            color = { }
            color[key] = res
            colors.push color
            return deferred.resolve(colors)
    return deferred.promise

  # Class method to show a specific key in redis
  #
  # @return [String] the value of the key
  #
  @show: (key) ->
    # build a Q promise in case redis lags
    deferred = Q.defer()

    Redis.get key, (err, res) ->
      return deferred.reject(err) if err
      return deferred.resolve(res)
    return deferred.promise

  # Class method to destroy a specific key in redis
  #
  # @return [Integer] number of keys deleted
  #
  @destroy: (key) ->
    # build a Q promise in case redis lags
    deferred = Q.defer()

    Redis.del key, (err, res) ->
      return deferred.reject(err) if err
      return deferred.resolve(res)
    return deferred.promise

  # Class method to destroy all keys with the KEY_PREFIX in them
  #
  # @return [Integer] number of keys deleted
  #
  @destroy_all: ->
    # build a Q promise in case redis lags
    deferred = Q.defer()

    Redis.keys "*#{KEY_PREFIX}*", (err, keys) ->
      Redis.del keys, (err, res) ->
        return deferred.reject(err) if err
        return deferred.resolve(res)
    return deferred.promise

module.exports = Color
