"use strict";
var app = app || {};

app.SavedColorView = Backbone.View.extend({

  el: '#saved-colors',

  initialize: function() {
    this.render();

    // make ajax call to /api/v1/colors
    app.Colors.fetch({
      remove: false,

      success: function(collection, response, options) {
        // addOne() for each color object
        console.log(response);
        if(response.length > 0) {
          response.each(function(color) {
            this.addOne(color);
          });
        }

      },

      error: function() {

      }
    });
  },

  render: function() {
    // this.$el.html(this.template());
    // this.$("#saved_colors").append(this.el);

    console.log(this.$el.html());
  },

  addOne: function(color) {
    app.SavedColorView.initialize(color);
  }

});
