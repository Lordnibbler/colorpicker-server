var app = app || {};

$(function() {
  // start backbone app
  window.dapp = new app.SwatchAppView();
  Backbone.history.start();

  // PRODUCTION:  start socket.io on our heroku server
  var socket = io.connect("http://colorpicker.herokuapp.com");

  // DEVELOPMENT: start socket.io locally
  // var socket = io.connect("http://127.0.0.1:1337");

  // save our connected socket inside our backbone `.dapp`
  window.dapp.socket = socket;
});
