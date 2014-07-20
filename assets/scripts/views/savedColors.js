"use strict";
var app = app || {};

app.SavedColorsView = Backbone.View.extend({

  el: '#saved-colors',
  events: {
    "click li.saved-color": 'clicked',
    "click li.saved-color .destroy": 'destroyClicked'
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
        // console.log('Error!', response);
      }
    });
  },


  /**
   * Instantiate a new SavedColorView and append its rendered el to the ul#saved-colors
   */
  addOne: function(color) {
    // grab only value in color object
    for (var key in color) {
      var key = key;
      var c   = color[key];
    }
    var savedColor = new app.SavedColorView({ color: c, key: key });
    this.$el.append(savedColor.render());
  },

  /**
   * Delegate to router to set colors to the data attr on the clicked savedColorView
   */
  clicked: function(event) {
    app.Router.setColors($(event.currentTarget).data('color'));
  },

  /**
   * Instantiate a SavedColor model with key, destroy it, and remove from DOM.
   */
  destroyClicked: function(event) {
    // prevent `clicked` event from being fired too!
    event.stopPropagation();
    event.preventDefault();

    var $el         = $(event.currentTarget);
    var $savedColor = $el.parent();
    var key         = $savedColor.data('key');
    var color       = $savedColor.data('color');

    var savedColor = new app.SavedColor({ color: color, key: key });
    savedColor.destroy({
      success: function(model, response, options) {
        $savedColor.remove();
      },

      error: function(model, response, options) {
        // console.log('destroy error', response);
      }
    });
  }

});
