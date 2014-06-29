Q = require 'q'

class Color
  # All keys will be stored in redis beginning with this prefix
  KEY_PREFIX: 'colorpicker:'

  # Creates a new Color, with a Redis object and the number of seconds until Redis keys expire.
  #
  constructor: (@redis, @key_expire_seconds) ->
    @key = @generate_key()

  # Creates a new color in the redis cache
  #
  # @param [String] color The ID generated for this resource server in the DSL
  #
  create: (color) ->
    # build a Q promise in case redis lags
    deferred = Q.defer()
    deferred.reject('color not provided') if !color

    # insert new k,v pair
    @redis.set @key, color (err, reply) =>
      return deferred.reject(err) if err
      @redis.expire @key, @key_expire_seconds

      # Successfully inserted new k/v pair
      return deferred.resolve(@key)
    return deferred.promise

  # generates a unique redis key in <key_prefix>:<uuid> = <key> syntax
  #
  # @return [String] a unique generated redis key
  #
  generate_key: ->
    return "#{@KEY_PREFIX}#{generate_uuid()}"

  # Suggests a UUID
  # @return [String] a UUID v4
  #
  generate_uuid: ->
    uuid.v4()

module.exports = Color
