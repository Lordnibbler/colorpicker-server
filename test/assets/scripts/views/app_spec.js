describe('views/app.js', function() {

  var View, color;

  beforeEach(function() {
    app.Colors.reset();
    View = new app.SwatchAppView();
  });

  describe('View', function() {
    it('has defaults', function() {
      expect(View.tagName).to.eql('div');
      expect(View.isTouchMove).to.eql(false);
      expect(View.startSaturation).to.eql(100);
    });
  });

  describe('events', function() {
    it('has the correct events', function() {
      expect(View.events()['click #header-tab']).to.eql('toggleheader');
      expect(View.events()['click #gradient']).to.eql('generateGradient');
      expect(View.events()['click #clear']).to.eql('clearColors');
      expect(View.events()['click #complement']).to.eql('generateComplementaryColors');
      expect(View.events()['click #huecomplement']).to.eql('generateHueShiftComplementaryColors');
      expect(View.events()['click #white']).to.eql('generateWhiteColors');
    });
  });

  describe('initialize', function() {
    it('binds to the change event of the editModel', function() {
      expect(View.editModel._events.change).to.not.eql(undefined);
    });

    it('binds to the add reset remove events of the Colors collection', function() {
      expect(app.Colors._events.add).to.not.eql(undefined);
      expect(app.Colors._events.reset).to.not.eql(undefined);
      expect(app.Colors._events.remove).to.not.eql(undefined);
    });

    it('sets the editModel attribute', function() {
      expect(View.editModel.color().hsl()).to.eql({h: 0, s: 100, l: 0});
    });

    describe('with ontouchstart available', function() {
      beforeEach(function() {
        View = new app.SwatchAppView({
          el: '<div id="appframe"><ul id="colors"><li id="edit" class="swatch"></li></ul></div>'
        });
      });

      it('binds to the appropriate touch events');
    });

    describe('with no touch functionality', function() {
      it('binds to the appropriate mouse events');
    });

    it('binds to the window resize event');
  });

  describe('render', function() {
    beforeEach(function() {
      // make a dummy fixture to test with
      View = new app.SwatchAppView({el: '<div id="appframe"><div id="edit"><h2></h2></div></div>'});
    });

    it('sets the edit swatch background CSS color to the editModel\'s HSL', function() {
      expect(View.$('#edit').css('background-color')).to.eql('');

      // update the color
      View.editModel = new app.Color({color: new Color({r: 0, g: 0, b: 0})});
      View.render();
      expect(View.$('#edit').css('background-color')).to.eql(View.editModel.color().rgbString());
    });

    it('sets the #edit h2\'s HTML to the HEX color code', function() {
      expect(View.$('#edit h2').html()).to.eql('');

      View.editModel = new app.Color({color: new Color({r:25, g: 50, b: 75})});
      View.render();
      expect(View.$('#edit h2').html()).to.eql(View.editModel.hexCss());
    });
  });

  describe('layout', function() {
    beforeEach(function() {
      View = new app.SwatchAppView({
        el: '<div id="appframe"><ul id="colors"><li id="edit" class="swatch"></li><li class="swatch"></li></ul></div>'
      });
      View.layout();
    });

    it('applies left and width CSS to each color .swatch', function() {
      View.$('#colors .swatch:not(#edit):not(.destroyed)').each(function(i, el) {
        expect($(el).css('left')).to.eql('0px');
        expect($(el).css('width')).to.eql('200px');
      });
    });

    it('applies left to the #edit (picker) <li>', function() {
      expect(View.$('#edit').css('left')).to.eql('0px');
    });
  });

  describe('addOne', function() {
    beforeEach(function() {
      View = new app.SwatchAppView({
        el: '<div id="appframe"><ul id="colors"><li id="edit" class="swatch"></li></ul></div>'
      });
    });

    describe('event', function() {
      // beforeEach(function() {
      //   window.socket = {
      //     emit: function(key, object) {
      //       return true;
      //     }
      //   };
      //   sinon.spy(window.socket, 'emit');
      //   sinon.spy(View, "addOne");
      // });
      //
      // it('is called when the app.Colors.add event is triggered', function() {
      //   // TODO: why is the View.addOne method not invoked? it has to be
      //   //
      //   // add a new color to colors collection to trigger addOne()
      //   // console.log(View.$el)
      //   app.Colors.add({
      //     color: new Color({r:25, g: 50, b: 75})
      //   });
      //   // console.log(View.$el)
      //   // console.log(View.addOne.callCount);
      //   // console.log(window.socket.emit.callCount);
      //   // console.log(app.Colors._events.add[0].callback());
      // });
      //
      // afterEach(function() {
      //   // console.log(View.addOne.callCount);
      //
      //   View.addOne.restore();
      //   window.socket.emit.restore();
      // });
    });

    it('appends a new color to #colors and sets view element\'s CSS left and width', function() {
      View.addOne(new app.Color({color: new Color({r:25, g: 50, b: 75})}));
      expect(View.$("#colors .swatch .color").attr('style')).to.include('background-color: rgb(25, 51, 76)');
    });
  });

  describe('addAll', function() {
    beforeEach(function() {
      // add some colors to the collection
      for(var i = 0; i < 3; i++) app.Colors.addFromHex('#00adeb');

      // add a view with some .swatch elements
      View = new app.SwatchAppView({
        el: '<div id="appframe"><ul id="colors"><li id="edit" class="swatch"></li><li class="swatch"></li><li class="swatch"></li></ul></div>'
      });

    });

    it('removes any existing color objects from the DOM', function() {
      expect(View.$el.find('#colors li:not(#edit)').length).to.eql(2);
      View.addAll()
      expect(View.$el.find('#colors li:not(#edit)').length).to.eql(3);
    });

    it('invokes addOne(color) for each app.Colors', function() {
      sinon.spy(View, 'addOne');
      View.addAll();
      expect(View.addOne.callCount).to.eql(3);
      View.addOne.restore();
    });

    it('invokes this.layout() (reset layout) if there are app.Colors is empty', function() {
      app.Colors.reset();
      sinon.spy(View, 'layout');
      expect(app.Colors.length).to.eql(0);
      View.addAll();
      expect(View.layout.callCount).to.eql(1);
      View.layout.restore();
    });
  });

  describe('toggleheader', function() {
    beforeEach(function() {
      // add a view with some .swatch elements
      View = new app.SwatchAppView({
        el: '<div id="appframe"><ul id="colors"><li id="edit" class="swatch"></li><li class="swatch"></li><li class="swatch"></li></ul></div>'
      });
    });

    it('toggles the class on and off', function() {
      expect(View.$el.hasClass('show-header')).to.eql(false);
      View.toggleheader();
      expect(View.$el.hasClass('show-header')).to.eql(true);
    });
  });

  describe('grabColor', function() {
    beforeEach(function() {
      // add a view with some .swatch elements
      View = new app.SwatchAppView({
        el: '<div id="appframe"><ul id="colors"><li id="edit" class="swatch"></li><li class="swatch"></li><li class="swatch"></li></ul></div>'
      });
    });

    it('adds a new color to the colors collection with the view\'s editModel color', function() {
      expect(app.Colors.length).to.eql(0);
      View.editModel = new app.Color({color: new Color({r:25, g: 50, b: 75})});
      View.grabColor();
      expect(app.Colors.length).to.eql(1);
      expect(app.Colors.first().color().rgb()).to.eql({r:25, g: 50, b: 75});
    });
  });

  describe('move', function() {
    beforeEach(function() {
      // add a view with some .swatch elements
      View = new app.SwatchAppView({
        el: '<div id="appframe"><ul id="colors"><li id="edit" class="swatch"></li><li class="swatch"></li><li class="swatch"></li></ul></div>'
      });
      View.editModel = new app.Color({color: new Color({r: 0, g: 0, b: 0})});
    });

    it('correctly adjusts the color\'s hue and lightness', function() {
      expect(View.editModel.color().rgb()).to.eql({r: 0, g: 0, b: 0});
      View.move(10,40);
      expect(View.editModel.color().rgb()).to.eql({r: 255, g: 255, b: 255});
    });
  });

  describe('scroll', function() {
    beforeEach(function() {
      // add a view with some .swatch elements and a #constraints div
      View = new app.SwatchAppView({
        el: '<div id="appframe"><ul id="colors"><li id="edit" class="swatch"><div id="constraints"><div></div></div></li><li class="swatch"></li><li class="swatch"></li></ul></div>'
      });

      // set saturation high so it thinks we've scrolled
      View.editModel = new app.Color({color: new Color({r: 0, g: 0, b: 0}).saturation(100)});
    });

    it('updates the color\'s saturation based on the scrollTop() attribute', function() {
      expect(View.editModel.color().saturation()).to.eql(100);
      View.scroll();
      expect(View.editModel.color().saturation()).to.eql(0);
    });
  });

  describe('mousemove', function() {
    beforeEach(function() {
      View = new app.SwatchAppView({
        el: '<div id="appframe"><ul id="colors"><li id="edit" class="swatch"></li></ul></div>'
      });
      View.editModel = new app.Color({color: new Color({r: 0, g: 0, b: 0})});
      sinon.spy(View, 'move');
    });

    it('invokes this.move() with the px and py', function() {
      View.mousemove({ pageX: 1, pageY: 2});
      expect(View.move.callCount).to.eql(1);
      expect(View.move.getCall(0).args[0]).to.eql(1);
      expect(View.move.getCall(0).args[1]).to.eql(2);
    });

    afterEach(function() {
      View.move.restore();
    })
  });

  describe('touchstart', function() {
    var event = { preventDefault: function() { return true; } };

    beforeEach(function() {
      sinon.spy(event, 'preventDefault');
      View.isTouchMoved = true;
    });

    it('invokes event.preventDefault', function() {
      expect(View.isTouchMoved).to.eql(true);
      View.touchstart(event);
      expect(event.preventDefault.callCount).to.eql(1);
      expect(View.isTouchMoved).to.eql(false);
    });

    afterEach(function() {
      event.preventDefault.restore();
    });
  });

  describe('touchmove', function() {
    var event = { originalEvent: { touches: [{pageX: 10, pageY: 50}]} };

    beforeEach(function() {
      View = new app.SwatchAppView({
        el: '<div id="appframe"><ul id="colors"><li id="edit" class="swatch"></li></ul></div>'
      });
      View.editModel = new app.Color({color: new Color({r: 0, g: 0, b: 0})});
      sinon.spy(View, 'move');
      View.isTouchMoved = false;
    });

    it('invokes view.Move and sets isTouchmoved === true', function() {
      expect(View.isTouchMoved).to.eql(false);
      View.touchmove(event);
      expect(View.move.callCount).to.eql(1);
      expect(View.move.getCall(0).args[0]).to.eql(10);
      expect(View.move.getCall(0).args[1]).to.eql(50);
      expect(View.isTouchMoved).to.eql(true);
    });

    afterEach(function() {
      View.move.restore();
    });
  });

  describe('touchend', function() {
    beforeEach(function() {
      View = new app.SwatchAppView({
        el: '<div id="appframe"><ul id="colors"><li id="edit" class="swatch"></li></ul></div>'
      });
      View.editModel = new app.Color({color: new Color({r: 0, g: 0, b: 0})});
      sinon.spy(View, 'grabColor');
      View.isTouchMoved = false;
    });

    it('invokes event.preventDefault', function() {
      expect(View.isTouchMoved).to.eql(false);
      View.touchend();
      expect(View.grabColor.callCount).to.eql(1);
    });

    afterEach(function() {
      View.grabColor.restore();
    });
  });

  describe('gesturestart', function() {
    var event = { preventDefault: function() { return true; } };

    beforeEach(function() {
      sinon.spy(event, 'preventDefault');
      View = new app.SwatchAppView({
        el: '<div id="appframe"><ul id="colors"><li id="edit" class="swatch"></li></ul></div>'
      });
      View.startSaturation = 100;
      View.editModel = new app.Color({color: new Color('#00adeb').saturation(5)});
    });

    it('invokes event.preventDefault and updates startSaturation', function() {
      expect(View.startSaturation).to.eql(100);
      View.gesturestart(event);
      expect(event.preventDefault.callCount).to.eql(1);
      expect(View.startSaturation).to.eql(5);
    });

    afterEach(function() {
      event.preventDefault.restore();
    });
  });

  describe('gesturechange', function() {
    var event = { originalEvent: { scale: 0.5 } };

    beforeEach(function() {
      View = new app.SwatchAppView({
        el: '<div id="appframe"><ul id="colors"><li id="edit" class="swatch"></li></ul></div>'
      });
      View.editModel = new app.Color({color: new Color('#00adeb').saturation(5)});
    });

    it('changes the editModel\'s saturation', function() {
      expect(View.editModel.color().saturation()).to.eql(5);
      View.gesturechange(event);
      expect(View.editModel.color().saturation()).to.eql(50);
    });
  });

  describe('generateGradient', function() {
    beforeEach(function() {
      sinon.spy(app.Router, 'setGradientColors');
      app.Colors.addFromHex('#00adeb');
    });

    it('invokes the Router.setGradientColors method', function() {
      View.generateGradient();
      expect(app.Router.setGradientColors.callCount).to.eql(1);
      expect(app.Router.setGradientColors.getCall(0).args[0]).to.eql(5);
    });

    afterEach(function() {
      app.Router.setGradientColors.restore();
    });
  });

  describe('clearColors', function() {
    beforeEach(function() {
      sinon.spy(app.Router, 'clearColors');
    });

    it('invokes the Router.clearColors method', function() {
      View.clearColors();
      expect(app.Router.clearColors.callCount).to.eql(1);
    });

    afterEach(function() {
      app.Router.clearColors.restore();
    });
  });

  describe('generateComplementaryColors', function() {
    beforeEach(function() {
      sinon.spy(app.Router, 'setComplementaryColors');
    });

    it('invokes the Router.clearColors method', function() {
      View.generateComplementaryColors();
      expect(app.Router.setComplementaryColors.callCount).to.eql(1);
    });

    afterEach(function() {
      app.Router.setComplementaryColors.restore();
    });
  });

  describe('generateHueShiftComplementaryColors', function() {
    beforeEach(function() {
      sinon.spy(app.Router, 'setHueShiftComplementaryColors');
    });

    it('invokes the Router.clearColors method', function() {
      View.generateHueShiftComplementaryColors();
      expect(app.Router.setHueShiftComplementaryColors.callCount).to.eql(1);
    });

    afterEach(function() {
      app.Router.setHueShiftComplementaryColors.restore();
    });
  });

  describe('generateWhiteColors', function() {
    beforeEach(function() {
      sinon.spy(app.Router, 'setWhiteColors');
    });

    it('invokes the Router.clearColors method', function() {
      View.generateWhiteColors();
      expect(app.Router.setWhiteColors.callCount).to.eql(1);
    });

    afterEach(function() {
      app.Router.setWhiteColors.restore();
    });
  });

  describe('saveColors', function() {
    beforeEach(function() {
      this.server = sinon.fakeServer.create();
      this.responseBody = '{"colorpicker:123":"00ADEB,983897"}';
      this.server.respondWith(
        "POST",
        "/api/v1/colors",
        [
          200,
          {"Content-Type": "application/json"},
          this.responseBody
        ]
      );
      this.eventSpy = sinon.spy();
    });

    afterEach(function() {
      this.server.restore();
    });

    it('foos', function() {
      // build new App View
      var View = new app.SwatchAppView({
        el: '<div id="appframe"><ul id="colors"><li id="edit" class="swatch"></li></ul></div>',
      });
      View.SavedColorsView = new app.SavedColorsView({ el: '<ul id="saved-colors"></ul>' });

      // add colors to save
      app.Colors.addFromHex('#00adeb');
      app.Colors.addFromHex('#983897');

      // save the colors!
      View.saveColor();

      // assert that we built the savedColor view for it
      console.log(View.SavedColorsView.$el);
      expect(View.SavedColorsView.$el.find('li.saved-color').length).to.eql(1);
    });


    // var View;
    //
    // beforeEach(function() {
    //   // build new App View
    //   var View = new app.SwatchAppView({
    //     el: '<div id="appframe"><ul id="colors"><li id="edit" class="swatch"></li></ul></div>',
    //   });
    //
    //   View.SavedColorsView = new app.SavedColorsView({ el: '<ul id="saved-colors"></ul>' });
    //   sinon.stub(app.SavedColor, 'save').yieldsTo('success', [''], [ { "colorpicker:123": '00ADEB,983897' } ]);
    //
    //   app.Colors.addFromHex('#00adeb');
    //   app.Colors.addFromHex('#983897');
    // });
    //
    // it('adds a SavedColorView for the app.Colors collection we are saving', function() {
    //   View.saveColor();
    //   expect(View.SavedColorsView.$el.find('li.saved-color').length).to.eql(1);
    // });
    //
    // after(function() {
    //   app.SavedColor.save.restore();
    // });
  });
});
