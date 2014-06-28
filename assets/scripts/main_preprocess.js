var app = app || {};

$(function() {
  // PRODUCTION:  start socket.io on our heroku server
  // @if NODE_ENV='PRODUCTION'
  var socket = io.connect("http://colorpicker.herokuapp.com/backbone");
  // @endif

  // DEVELOPMENT: start socket.io locally
  // @if NODE_ENV='DEVELOPMENT'
  var socket = io.connect("http://127.0.0.1/backbone");
  // @endif

  // save our connected socket inside our backbone `.dapp`
  window.socket = socket;

  // start backbone app
  window.dapp = new app.SwatchAppView();
  Backbone.history.start();
});
