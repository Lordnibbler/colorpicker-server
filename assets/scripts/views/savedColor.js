"use strict";
var app = app || {};

/**
 * Used for Backbone.sync functionality (model.save()) to persist app.Colors.hexString() to Redis
 */
app.SavedColorView = Backbone.View.extend({

  template: _.template('<li class="saved-color" data-color="<%= color %>" data-key="<%= key %>"><button class="destroy btn"><i class="icon-remove icon-large"></i></button><%= spans %></li>'),
  color: undefined,

  events: {
    "click": "clicked"
  },

  initialize: function(options) {
    this.color = options.color;
    this.key   = options.key;
  },

  render: function() {
    return this.template({
      color: this.color,
      spans: this.renderBackgroundSpans(),
      key:   this.key
    });
  },

  /**
   * Used for templating.  Renders spans for each color in this.color
   * @example
   *   "<span style='background:#983897; height:100%; width:20%;'></span>"
   */
  renderBackgroundSpans: function() {
    var colors = this.color.split(',');
    var width  = (100 / colors.length).toString();
    var spans  = [];

    colors.forEach(function(color, index, array) {
      spans += '<span style="background: #' + color + '; height: 100%; width: ' + width + '%;"></span>';
    });
    return spans;
  }

});
