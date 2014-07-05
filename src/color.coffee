Q    = require 'q'
uuid = require 'node-uuid'

class Color
  # All keys will be stored in redis beginning with this prefix
  KEY_PREFIX: 'colorpicker:'

  # Creates a new Color, with a Redis object and the number of seconds until Redis keys expire.
  #
  constructor: (@redis, @key_expire_seconds) ->
    @key = @_generate_key()

  # generates a unique redis key in <key_prefix>:<uuid> = <key> syntax
  #
  # @return [String] a unique generated redis key
  #
  _generate_key: ->
    return "#{@KEY_PREFIX}#{@_generate_uuid()}"

  # Suggests a UUID
  # @return [String] a UUID v4
  #
  _generate_uuid: ->
    uuid.v4()

  # Creates a new color in the redis cache
  #
  # @param [String] color The comma-delimited hex string of the colors to save to redis
  #
  create: (color) ->
    # build a Q promise in case redis lags
    deferred = Q.defer()
    deferred.reject('color not provided') if !color

    # insert new k,v pair
    @redis.incr '0', (err, id) =>
      @redis.set id, color, (err, res) =>
        return deferred.reject(err) if err
        @redis.expire id, @key_expire_seconds

        # Successfully inserted new k/v pair
        return deferred.resolve(id)
    return deferred.promise

  # Class method to return all colors (keys) in Redis
  #
  # @return [Object] all colors from the redis cache
  #
  @index: ->
    # build a Q promise in case redis lags
    deferred = Q.defer()

    # get all redis keys in array
    @redis.keys '*', (err, res) =>
      return deferred.reject(err) if err

      # get value of each key and append to object
      colors = {}
      for key in res
        @redis.get key, (err, res) =>
          return deferred.reject(err) if err
          colors[key] = res

      return deferred.resolve(colors)
    return deferred.promise

module.exports = Color
