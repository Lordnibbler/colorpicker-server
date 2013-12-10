var app = app || {};

$(function() {
  "use strict";

  app.ColorList = Backbone.Collection.extend({
    model: app.Color,

    addFromHex: function(hex) {
      this.limitCollectionSize(4);
      var c = Color(hex);
      this.add({color: c});
    },

    limitCollectionSize: function(size) {
      if (this.length > size-1) {
        this = this.first(size);
      }
    }

  });

  // Global color collection
  app.Colors = new app.ColorList();
});
