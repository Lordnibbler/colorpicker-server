Redis = require 'redis'

module.exports.redis  = do ->
  redis = Redis.createClient(config.redis.port, config.redis.host, config.redis.options)
  redis.auth(config.redis.auth.split(":")[1]) if config.redis.auth
  return redis
