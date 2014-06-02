var app = app || {};

$(function() {
  "use strict";

  app.ColorList = Backbone.Collection.extend({
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
    }

  });

  // Global color collection
  app.Colors = new app.ColorList();
});
