var app = app || {};

$(function() {
  "use strict";

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

      this.editModel = new app.Color({h: 180, s: 100, l: 50});
      this.editModel.on("change", this.render, this);

      // ensure touch-enabled devices have saturation === 100 by default
      this.editModel.color().saturation(100);

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
        this.$("#constraints").mousemove(_.bind(this.mousemove, this))
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

    addAll: function() {
      this.$("#colors li:not(#edit)").remove();
      app.Colors.each(this.addOne, this);

      if(app.Colors.length === 0) {
        this.layout();
      }
    },

    toggleheader: function(event) {
      this.$el.toggleClass("show-header");
    },

    grabColor: function(event) {
      app.Colors.add({
        color: new Color(this.editModel.color().rgb())
      });
    },

    /**
     * Converts colors to Halo's `r,g,b,a\n` format
     * Sets all lights to same color for live-preview
     */
    colorToRgbString: function(color) {
      var rgbColors =
        color.rgb().r + ',' +
        color.rgb().g + ',' +
        color.rgb().b + ',' +
        color.rgb().a + '\n';

      // TODO: make this a prototype function called .repeat()
      return rgbColors + rgbColors + rgbColors + rgbColors + rgbColors;
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

      this.colorChanged(this.editModel);
    },

    /**
     * send our Node.js app the current live color data
     */
    colorChanged: function(color) {
      window.socket.emit('colorChanged', {
        color: this.colorToRgbString(color)
      });
    },

    scroll: function(event) {
      var col, offset = this.$("#constraints").scrollTop() / 10;
      offset = Math.max(0, Math.min(100, offset));
      this.editModel.color().saturation(offset);
      this.editModel.trigger("change");
    },

    mousemove: function(event) {
      this.move(event.pageX, event.pageY);
    },

    touchstart: function(event) {
      event.preventDefault();
      this.isTouchMoved = false;
    },

    touchmove: function(event) {
      this.move(event.originalEvent.touches[0].pageX, event.originalEvent.touches[0].pageY);
      this.isTouchMoved = true;
    },

    /**
     * adds color to app.Colors collection if touch event ends
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
      app.Router.setGradientColors(app.Colors.first().hexCss().substring(1));
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
});
