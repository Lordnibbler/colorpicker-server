"use strict";
var app = app || {};

app.SavedColor = Backbone.Model.extend({

  url: 'api/v1/colors',
  color: undefined

});
