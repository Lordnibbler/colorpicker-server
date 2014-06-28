"use strict";
var app = app || {};

var Router = Backbone.Router.extend({

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
   * @param '00ADEB,00ED79,34EF00,EDF200,F43A00,'
   */
  setColors: function(param) {
    var colors = (param ? param.split(",") : {})
    app.Colors.setColors(colors);
  },

  /**
   * generates and sets a gradient as the current colors
   * @param color a hex string with no #
   * @example setGradientColors('00adeb', 5);
   */
  setGradientColors: function(color, length) {
    if(color.length === 6 && app.Colors.length > 0) app.Colors.setGradientColors(color, length);
  },

  /**
   * picks first color in app.Colors and generates a ramp between them
   */
  setComplementaryColors: function() {
    app.Colors.setComplementaryColors(5);
  },

  /**
   * picks first color in app.Colors and generates a hue-shifting ramp between them
   */
  setHueShiftComplementaryColors: function() {
    app.Colors.setHueShiftComplementaryColors(5);
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
      window.socket.emit('colorSet', {
        color: (colors || app.Colors.toRgbString())
      });
    }
  },

  /**
   * clears all colors and removes them from URL; issues a solid black to arduino
   */
  clearColors: function(event) {
    this.setColors('');
    this.colorSet('000,000,000,000\n000,000,000,000\n000,000,000,000\n000,000,000,000\n000,000,000,000');
    this.navigate('', {trigger: false, replace: true});
  },

  /**
   * Sets all white colors
   */
  setWhiteColors: function(event) {
    this.setColors('FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF');
    this.colorSet('255,255,255,255\n255,255,255,255\n255,255,255,255\n255,255,255,255\n255,255,255,255');
  }

});

app.Router = new Router();
