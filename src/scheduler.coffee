SunCalc = require 'suncalc'
Redis   = require './redis'

LONGITUDE_SAN_FRANCISCO = 37.7749295
LATITUDE_SAN_FRANCISCO  = -122.4194155

#
# @example
#   get_time(LONGITUDE_SAN_FRANCISCO, LATITUDE_SAN_FRANCISCO, 'sunrise')
#   # => Fri Mar 27 2015 07:03:55 GMT-0700 (PDT)
#
get_time: (longitude, latitude, time_key) ->
  times = SunCalc.getTimes new Date(), longitude, latitude
  times[time_key]

#
# @return [Boolean] if its currently the same hour as the {time_key}
# @example check if its the same hour as the 'sunrise' {time_key}
#   is_hour_in_sf('sunrise')
#   # => true
#
is_hour_in_sf: (time_key) ->
  now = new Date()
  times = get_time(LONGITUDE_SAN_FRANCISCO, LATITUDE_SAN_FRANCISCO, time_key)
  now.getHours() == times.getHours()

date = new Date()
console.log(date.getHours())
