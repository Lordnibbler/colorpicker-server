"use strict";
var app = app || {};

app.SavedColorsView = Backbone.View.extend({

  el: '#saved-colors',
  events: {
    "click li.saved-color": 'clicked'
  },

  initialize: function() {
    // make ajax call to /api/v1/colors
    var self = this;
    app.SavedColors.fetch({
      remove: false,
      silent: true,

      success: function(collection, response, options) {
        // addOne() for each color object
        if(response.length > 0) {
          response.forEach(function(color, index, array) {
            self.addOne(color);
          });
        }

      },

      error: function(collection, response, options) {
        console.log('Error!', response);
      }
    });
  },


  /**
   * Instantiate a new SavedColorView and append its rendered el to the ul#saved-colors
   */
  addOne: function(color) {
    // grab only value in color object
    for (var a in color) var c = color[a];
    var savedColor = new app.SavedColorView({ color: c });
    this.$el.append(savedColor.render());
  },

  clicked: function(event) {
    app.Router.setColors($(event.currentTarget).data('color'));
  }

});
