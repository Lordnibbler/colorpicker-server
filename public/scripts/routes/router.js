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
          color: this.colorsToRgbString()
        });
      }
    },

    /**
     * Converts colors to Halo's `r,g,b,a\n` format
     */
    colorsToRgbString: function() {
      var rgbColors = "";
      app.Colors.each(function(color){
        rgbColors += color.rgb().r + ',' + color.rgb().g + ',' + color.rgb().b + ',' + color.rgb().a + '\n';
      });
      return rgbColors;
    }
  });

  app.Router = new ColorRouter();
});
