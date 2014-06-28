var app = app || {};

$(function() {
  // TODO: use grunt to choose the correct URI here

  // PRODUCTION:  start socket.io on our heroku server
  var socket = io.connect("http://colorpicker.herokuapp.com/backbone");

  // DEVELOPMENT: start socket.io locally
  // var socket = io.connect("http://127.0.0.1/backbone");

  // save our connected socket inside our backbone `.dapp`
  window.socket = socket;

  // start backbone app
  window.dapp = new app.SwatchAppView();
  Backbone.history.start();
});
