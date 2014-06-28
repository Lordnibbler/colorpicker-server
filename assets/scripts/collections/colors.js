"use strict";
var app = app || {};

var Collection = Backbone.Collection.extend({

  model: app.Color,

  /**
   * builds a collection of Color models
   * based on the colors string
   * @param '00ADEB,00ED79,34EF00,EDF200,F43A00,'
   */
  setColors: function(colors) {
    colors = _.reject(colors, function(color) {
      return color.length == 0;
    });

    this.reset();
    var _this = this;
    _.each(colors, function(color) {
      _this.addFromHex("#" + color);
    });
  },

  /**
   * add a new color object to the Colors collection
   */
  addFromHex: function(hex, index) {
    var c = Color(hex);
    index ? this.add({ color: c }, { at: index }) : this.add({color: c});
  },

  /**
   * Converts colors to Halo's `r,g,b,a\n` format
   */
  toRgbString: function() {
    var rgbColors = "";
    this.each(function(color){
      rgbColors += color.rgb().r + ',' + color.rgb().g + ',' + color.rgb().b + ',' + color.rgb().a + '\n';
    });
    return rgbColors;
  },

  /**
   * generates a rainbow spectrum based on the bitwise complement of a single color
   * then adds them to the colors collection
   */
  setComplementaryColors: function(length) {
    // only works if we have 1 color in the collection
    if (this.length > 0) {
      // reset to just the first color
      this.reset(this.first());

      // build a rainbow spectrum based on the bitwise complement to the color in collection
      var rainbow = new Rainbow();
      rainbow.setSpectrum(this.first().hexCss(), this.first().bitwiseComplement());
      rainbow.setNumberRange(1, length);

      // add new colors to collection
      for (var i = 1; i < (length); i++) {
        this.addFromHex('#' + rainbow.colorAt(i+1));
      }
    }
  },

  /**
   * sets a hue shift based on the bitwise complement of a single color
   * then adds them to the colors collection
   */
  setHueShiftComplementaryColors: function(length) {
    // only works if we have at least 1 color in the collection
    if (this.length > 0) {
      // reset to just the first color
      this.reset(this.first());

      // generate and add the bitwise complement to the collection
      var color = this.first();
      var bitwiseColor = Color('#' + color.bitwiseComplement());

      // calculate the amount of hue to add on each iteration
      // by getting the difference of hue between complementary
      // colors divided by the number of steps we want it to take
      var hAmountToAdd = Math.abs(color.color().hsl().h - bitwiseColor.hsl().h) / (length-1);
      var lAmountToAdd = Math.abs(color.color().hsl().l - bitwiseColor.hsl().l) / (length-1);

      // if we should be shrinking hue, negate hAmountToAdd
      if (color.color().hsl().h > bitwiseColor.hsl().h) hAmountToAdd = -hAmountToAdd;
      if (color.color().hsl().l > bitwiseColor.hsl().l) lAmountToAdd = -lAmountToAdd;

      // for length of the ramp -1, add the next color at the respective index i
      for (var i = 1; i < length; i++) {
        this.add({
          color: Color({
            h: color.color().hsl().h + (hAmountToAdd * i),
            s: color.color().hsl().s + (lAmountToAdd * i),
            l: color.color().hsl().l
          })
        });
      }
    }
  },

  /**
   * generates and sets a gradient as the current colors
   * @param color a hex string with no #
   * @example setGradientColors('00adeb', 5);
   */
  setGradientColors: function(color, length) {
    // generate gradient array based on color and length vars
    var modifier = (this.shadeColor(color, 20) == color ? -20 : 20);
    var array = [color];
    for(var i = 0; i < (length-1); i++) {
      array.push(this.shadeColor(array[i], modifier));
    }
    array.push('');

    // use existing setColors function to push colors to the router
    this.setColors(array);
  },

  /**
   * TODO: move to color.js or helper library
   * shades (lightens/darkens) a hex color,
   * @param color a 6 character hex code string
   * @param percent any signed integer
   * @example shadeColor('00adeb', 50);
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
  }

});

// Global color collection
app.Colors = new Collection();
