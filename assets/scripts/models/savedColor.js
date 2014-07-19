"use strict";
var app = app || {};

app.SavedColor = Backbone.Model.extend({

  color: undefined,
  key: undefined,
  idAttribute: 'key',
  urlRoot: 'api/v1/colors',
  currentAction: undefined,

  /**
   * This modifies the URL based upon the current state of this model.
   *
   * @returns {string} the URL that should be used
   */
  url: function() {
    // PUT, DELETE
    if(this.has('key') && this.currentAction === 'delete')
      return this.urlRoot + '/' + this.get('key');
    // GET, POST
    else
      return this.urlRoot;
  },

  /**
   * Taps into method chain and sets the `currentAction` to the appropriate
   * HTTP verb for our `url()` method
   */
  sync: function(method, model, options) {
    this.currentAction = method;
    return Backbone.sync(method, model, options);
  }

});
