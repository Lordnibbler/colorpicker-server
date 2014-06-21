"use strict";
var app = app || {};

app.SwatchAppView = Backbone.View.extend({

  el: "#appframe",

  isTouchMove: false,
  startSaturation: 100,

  events: {
    "click #header-tab": "toggleheader",
    "click #gradient": "generateGradient",
    "click #clear": "clearColors",
    "click #complement": "generateComplementaryColors",
    "click #huecomplement": "generateHueShiftComplementaryColors",
    "click #white": "generateWhiteColors"
  },

  initialize: function() {
    app.Colors.on("add",    this.addOne, this);
    app.Colors.on("reset",  this.addAll, this);
    app.Colors.on("remove", this.layout, this);

    this.editModel = new app.Color({color: new Color({h: 0, s: 100, l: 0})});
    this.editModel.on("change", this.render, this);

    if('ontouchstart' in document.documentElement) {
      // if we're on a touch-enabled device
      this.$("#edit")
        .bind("touchstart",    _.bind(this.touchstart,    this))
        .bind("touchmove",     _.bind(this.touchmove,     this))
        .bind("touchend",      _.bind(this.touchend,      this))
        .bind("gesturestart",  _.bind(this.gesturestart,  this))
        .bind("gesturechange", _.bind(this.gesturechange, this));
    } else {
      // no touch functionality
      this.$("#constraints")
        .mousemove(_.bind(this.mousemove, this))
        .scroll(_.bind(this.scroll, this))
        .click(_.bind(this.grabColor, this))
        .scrollTop(2000); // set saturation full by default
    }

    // reinvoke layout method when window is resized
    $(window).resize(_.bind(this.layout, this));
  },

  /**
   * update background CSS and #edit DOM text to currently selected color in this.editModel
   */
  render: function() {
    this.$("#edit").css({
      "background": this.editModel.hslCss()
    });

    this.$("#edit h2").html(this.editModel.hexCss());
  },

  layout: function() {
    var w = $(window).width(),
        sliceSize = Math.floor(w / (app.Colors.length + 2));

    this.$('#colors .swatch:not(#edit):not(.destroyed)').each(function(i, el) {
      $(el).css({
        left: i * sliceSize,
        width: sliceSize,
      });
    });

    this.$("#edit").css({
      left: app.Colors.length * sliceSize,
    });
  },

  /**
   * add a new colorView (views/color.js),
   * append its element to the dom, and
   * update the CSS
   */
  addOne: function(color) {
    var view = new app.ColorView({model: color});
    this.$("#colors").append(view.render().el);

    view.$el.css({
      left: this.$("#edit").css("left"),
      width: this.$("#edit").css("width")
    });

    // defer the render for a frame
    setTimeout(_.bind(function() {
      view.$el.addClass("animating");
      this.layout();
    }, this), 0);
  },

  /**
   * Remove all li.color except for #edit
   * Invoke this.addOne for each color in the colors collection
   * Reset the layout if the collection is empty.
   */
  addAll: function() {
    this.$("#colors li:not(#edit)").remove();
    app.Colors.each(this.addOne, this);

    if(app.Colors.length === 0) {
      this.layout();
    }
  },

  /**
   * Toggles the .show-header class on our view's element
   */
  toggleheader: function(event) {
    this.$el.toggleClass("show-header");
  },

  /**
   * Adds a color to the colors collection with the editModel's current rgb
   */
  grabColor: function(event) {
    app.Colors.add({
      color: new Color(this.editModel.color().rgb())
    });
  },

  move: function(px, py) {
    var editEl = this.$("#edit"),
        w      = editEl.width(),
        h      = editEl.height(),
        x, y, offset, hue, lit, col;

    offset = editEl.offset();

    x = Math.max(0, px - offset.left);
    y = Math.max(0, py - offset.top);

    hue = Math.floor(x / w * 360),
    lit = Math.floor(y / h * 100);
    this.editModel.color().hue(hue).lightness(lit);
    this.editModel.trigger("change");

    // send colors via socket
    // TODO: hook into the editModel change event
    this.editModel.colorChanged();
  },

  scroll: function(event) {
    var col, offset = this.$("#constraints").scrollTop() / 10;
    offset = Math.max(0, Math.min(100, offset));
    this.editModel.color().saturation(offset);
    this.editModel.trigger("change");
  },

  /**
   * fire a call to this.move() every time mousemove is called
   */
  mousemove: function(event) {
    this.move(event.pageX, event.pageY);
  },

  /**
   * when touch starts, dont move the page around; instead set isTouchMoved = false
   */
  touchstart: function(event) {
    event.preventDefault();
    this.isTouchMoved = false;
  },

  /**
   * fire a call to this.move() every time touchmove is called
   */
  touchmove: function(event) {
    this.move(event.originalEvent.touches[0].pageX, event.originalEvent.touches[0].pageY);
    this.isTouchMoved = true;
  },

  /**
   * adds color to app.Colors collection if touch event ends (stopped dragging)
   */
  touchend: function(event) {
    if(! this.isTouchMoved) {
      this.grabColor();
    }
  },

  /**
   * sets the startSaturation before our gestureChange
   * event is fired to alter the saturation of colorpicker
   */
  gesturestart: function(event) {
    event.preventDefault();
    this.startSaturation = this.editModel.get("s");
  },

  /**
   * updates the colorpicker's saturation based on
   * the touch pinch-to-zoom gesture's scale attr
   */
  gesturechange: function(event) {
    if(event.originalEvent.scale) {
      var offset = Math.max(0, Math.min(100, this.startSaturation * event.originalEvent.scale));
      this.editModel.color().saturation(offset);
      this.editModel.trigger("change");
    }
  },

  /**
   * Delegate to the router to generate a gradient
   * based on the first Color in our app.Colors collection
   */
  generateGradient: function(event) {
    app.Router.setGradientColors(app.Colors.first().hexCss().substring(1), 5);
    this.toggleheader();
  },

  clearColors: function(event) {
    app.Router.clearColors();
    this.toggleheader();
  },

  /**
   * Generates a bitwise complementary color and a ramp between them
   */
  generateComplementaryColors: function(event) {
    app.Router.setComplementaryColors();
    this.toggleheader();
  },

  /**
   * Generates a bitwise complementary color and a hue shift between them
   */
  generateHueShiftComplementaryColors: function(event) {
    app.Router.setHueShiftComplementaryColors();
    this.toggleheader();
  },

  /**
   * Generates all white colors
   */
  generateWhiteColors: function(event) {
    app.Router.setWhiteColors();
    this.toggleheader();
  }

});
