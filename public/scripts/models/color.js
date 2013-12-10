var app = app || {};

$(function() {
  "use strict";

  app.Color = Backbone.Model.extend({
    defaults: {
      color: new Color()
    },

    /**
     * Setter and getter for manipulable color objects
     */
    color: function(color) {
      if(color) {
        this.set({color: color})
      }
      return this.get("color");
    },

    hslCss: function() {
      return this.color().hslString();
    },

    rgbCss: function() {
      return this.color().rgbString();
    },

    hexCss: function() {
      return this.color().hexString();
    },

    rgb: function() {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.hexCss());
      return result ? {
          r: String("000" + parseInt(result[1], 16)).slice(-3),
          g: String("000" + parseInt(result[2], 16)).slice(-3),
          b: String("000" + parseInt(result[3], 16)).slice(-3),
          a: "000"
      } : null;
    }
  });

});
