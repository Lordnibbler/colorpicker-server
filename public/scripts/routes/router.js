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
     * generates and sets a gradient as the current colors
     */
    setGradientColors: function(color) {
      if(color.length === 6 && app.Colors.length > 0) {
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
     * picks first color in app.Colors and generates a ramp between them
     */
    setComplementaryColors: function() {
      app.Colors.generateComplementaryColors(5);
    },

    /**
     * picks first color in app.Colors and generates a hue-shifting ramp between them
     */
    setHueShiftComplementaryColors: function() {
      app.Colors.generateHueShiftComplementaryColors(5);
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
     * Sends all current colors, in Halo `r,g,b,a\n` format
     */
    colorSet: function(colors) {
      if(window.socket) {
        var color = colors;
        if(colors === undefined) {
          color = app.Colors.toRgbString();
        }

        window.socket.emit('colorSet', {
          color: color
        });
      }
    },

    /**
     * clears all colors and removes them from URL; issues a solid black to arduino
     */
    clearColors: function(event) {
      if (app.Colors.length > 0) {
        this.setColors('');
        this.colorSet('000,000,000,000\n000,000,000,000\n000,000,000,000\n000,000,000,000\n000,000,000,000');
        this.navigate('', {trigger: false, replace: true});
      }
    },

    /**
     * Sets all white colors
     */
    setWhiteColors: function(event) {
      this.setColors('FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF');
      this.colorSet('255,255,255,255\n255,255,255,255\n255,255,255,255\n255,255,255,255\n255,255,255,255');
    }

  });

  app.Router = new ColorRouter();
});
