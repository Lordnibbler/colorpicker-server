  var app = app || {};

$(function() {
  "use strict";

  var ColorRouter = Backbone.Router.extend({
    routes: {
      "*colors": "setColors"
    },

    initialize: function(ops) {
      app.Colors.on("add", this.pushColorState, this);
      app.Colors.on("remove", this.pushColorState, this);
    },

    /**
     * builds a collection of Color models
     * based on the params in the url
     * ie. #00000, ff0000, ccff000
     */
    setColors: function(param) {
      var colors = param.split(",");

      colors = _.reject(colors, function(color) {
        return color.length == 0;
      });

      app.Colors.reset();

      _.each(colors, function(color) {
        app.Colors.addFromHex("#" + color);
      });
    },

    /**
     * Pushes the current Colors state to the path
     */
    pushColorState: function() {
      var hash = app.Colors.reduce(function(memo, color) {
        return memo + color.hexCss().substr(1) + ',';
      }, "");

      // emit `colorSet` event to node.js server
      this.colorSet();

      // append to URL
      this.navigate(hash, {trigger: false, replace: true});
    },


    /**
     * Emits a `colorSet` event to our Node.js server
     * Sends all 4 current colors, in Halo `r,g,b,a\n` format
     */
    colorSet: function() {
      // send our Node.js app the current live color data
      if(window.socket) {
        window.socket.emit('colorSet', {
          color: app.Colors.toRgbString()
        });
      }
    },

  });

  app.Router = new ColorRouter();
});
