"use strict";
var app = app || {};

app.SavedColorView = Backbone.View.extend({
  tagName: "ul",
  className: "saved-color",
  template: _.template('<li data-color="<%= color %>"></li>'),
  color: undefined,

  initialize: function(color) {
    this.color = color;
  },

  render: function() {

  },

  renderBackgroundSpans: function() {

  }
});
