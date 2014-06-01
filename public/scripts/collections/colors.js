var app = app || {};

$(function() {
  "use strict";

  app.ColorList = Backbone.Collection.extend({
    model: app.Color,

    addFromHex: function(hex) {
      var c = Color(hex);
      this.add({color: c});
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
    }

  });

  // Global color collection
  app.Colors = new app.ColorList();
});
