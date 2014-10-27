"use strict";
var app = app || {};

var Router = Backbone.Router.extend({

  routes: {
    "*colors": "setColors"
  },

  initialize: function(options) {
    app.Colors.on("add",    this.pushColorState, this);
    app.Colors.on("remove", this.pushColorState, this);
    app.Colors.on("reset",  this.pushColorState, this);
  },

  /**
   * generates and sets a gradient as the current colors
   * @param color a hex string with no #
   * @example setGradientColors('00adeb', 5);
   */
  setGradientColors: function(length) {
    if(app.Colors.length > 0)
      app.Colors.setGradientColors(app.Colors.first().hexCss().substr(1), length);
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
    this.emitColorSet();

    // append to URL
    this.navigate(hash, {trigger: false, replace: true});
  },

  /**
   * builds a collection of Color models based on the params in the url
   * @note performs a .reset() on the collection, triggering any event listeners
   * @param '00ADEB,00ED79,34EF00,EDF200,F43A00,'
   */
  setColors: function(param) {
    app.Colors.setColors(param);
  },

  /**
   * Emits a `colorSet` event to our Node.js server
   * If no argument is provided, invokes .toRgbObjects() on the collection
   * @param [Array<Object>] colors array of colors objects with keys r,g,b
   */
  emitColorSet: function(colors) {
    if(window.socket) {
      window.socket.emit('colorSet', {
        color: (colors || app.Colors.toRgbObjects())
      });
    }
  },

  /**
   * clears all colors and removes them from URL; issues a solid black to arduino
   * @bug
   *   .reset() triggers pushColorState, which invokes emitColorSet(''), which is unnecessary
   *   since arduino doesnt recognize '' as off.
   */
  clearColors: function(event) {
    // empty the collection, trigger this.pushColorState to ensure URL is empty
    app.Colors.reset();

    // set all lights on arduino to off/black
    var black = {r: 0, g: 0, b: 0};
    this.emitColorSet([black, black, black, black, black]);
  },

  /**
   * Sets all white colors
   */
  setWhiteColors: function(event) {
    this.setColors('FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF');
  }

});

app.Router = new Router();
