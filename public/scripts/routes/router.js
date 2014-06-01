  var app = app || {};

$(function() {
  "use strict";

  var ColorRouter = Backbone.Router.extend({
    routes: {
      "gradient/:color": 'setGradientColors',
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
     * generates and sets a gradient as the current colors
     */
    setGradientColors: function(color) {
      if(color.length === 6) {
        // generate gradient based on `color`
        var modifier = (this.shadeColor(color, 20) == color ? -20 : 20);
        var array = [color];
        for(var i = 0; i < 4; i++) {
          array.push(this.shadeColor(array[i], modifier));
        }

        // use existing setColors function to push colors to the router
        this.setColors(array.join(','));
      }
    },

    /**
     * shades (lightens/darkens) a hex color,
     * either without '#' prefix
     * percent is any signed integer
     */
    shadeColor: function(color, percent) {
      var R = parseInt(color.substring(0, 2), 16);
      var G = parseInt(color.substring(2, 4), 16);
      var B = parseInt(color.substring(4, 6), 16);

      R = parseInt(R * (100 + percent) / 100);
      G = parseInt(G * (100 + percent) / 100);
      B = parseInt(B * (100 + percent) / 100);

      R = (R < 255) ? R : 255;
      G = (G < 255) ? G : 255;
      B = (B < 255) ? B : 255;

      var RR = ((R.toString(16).length === 1) ? '0' + R.toString(16) : R.toString(16));
      var GG = ((G.toString(16).length === 1) ? '0' + G.toString(16) : G.toString(16));
      var BB = ((B.toString(16).length === 1) ? '0' + B.toString(16) : B.toString(16));

      return RR + GG + BB;
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
