"use strict";
var app = app || {};

app.ColorList = (function(Backbone, $){

  var Collection = Backbone.Collection.extend({

    model: app.Color,

    /**
     * add a new color object to the Colors collection
     */
    addFromHex: function(hex, index) {
      var c = Color(hex);
      index ? this.add({color: c, at: index}) : this.add({color: c});
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
    generateComplementaryColors: function(length) {
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
     * generates a hue shift based on the bitwise complement of a single color
     * then adds them to the colors collection
     */
    generateHueShiftComplementaryColors: function(length) {
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
    }
  });

  // Global color collection
  app.Colors = new Collection();

  return Collection;
})(Backbone, jQuery);
