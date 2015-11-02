var rtg = require("url").parse(process.env.REDISTOGO_URL);

module.exports = {
  "server": {
    "host": "0.0.0.0",
    "domain": "colorpicker.herokuapp.com",
    "port": process.env.PORT
  },

  "log": {
    "level": "debug"
  },

  "redis": {
    "port": rtg.port,
    "host": rtg.hostname,
    "auth": rtg.auth,
    "options": {}
  }
}
