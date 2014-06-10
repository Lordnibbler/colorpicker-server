"use strict";
var app = app || {};

app.Color = (function(Backbone, $) {
  var View = Backbone.Model.extend({
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

    /**
     * @return An object representation of rgba values for the current
     * this.color(), padded with 0's to ensure length of 3
     */
    rgb: function() {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.hexCss());
      return result ? {
          r: String("000" + parseInt(result[1], 16)).slice(-3),
          g: String("000" + parseInt(result[2], 16)).slice(-3),
          b: String("000" + parseInt(result[3], 16)).slice(-3),
          a: "000"
      } : null;
    },

    /**
     * generates the 6-char hex bitwise complementary color to this color,
     * padding with 0 if necessary
     */
    bitwiseComplement: function() {
      return ('000000' + (('0xffffff' ^ '0x' + this.hexCss().substring(1)).toString(16))).slice(-6);
    }
  });

  return View;

})(Backbone, jQuery);
