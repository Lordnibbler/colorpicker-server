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
      expect(View.events['click #header-tab']).to.eql('toggleheader');
      expect(View.events['click #gradient']).to.eql('generateGradient');
      expect(View.events['click #clear']).to.eql('clearColors');
      expect(View.events['click #complement']).to.eql('generateComplementaryColors');
      expect(View.events['click #huecomplement']).to.eql('generateHueShiftComplementaryColors');
      expect(View.events['click #white']).to.eql('generateWhiteColors');
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
      it('binds to the appropriate touch events');
    });

    describe('with no touch functionality', function() {
      beforeEach(function() {
        View = new app.SwatchAppView({el: '<div id="appframe"><div id="constraints"></div></div>'});
      });

      it('binds to the appropriate mouse events', function() {
        // console.log(View.$('#constraints'));
        // console.log(View.$('#constraints')._events);
        // console.log($(window).data('events'));
        // console.log($._data($(window), 'events'));
      });
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

  describe('', function() {
    it('')
  });
});
