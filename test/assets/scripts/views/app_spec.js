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
      it('binds to the appropriate mouse events', function() {
        console.log(View.$el.selector)
      });
    });

    it('binds to the window resize event');
  });

  describe('render', function() {
    beforeEach(function() {
      View.render();
    });

    it('sets the edit swatch background CSS color to the editModel\'s HSL', function() {

      console.log(View.editModel.color().hsl());
      console.log(View.editModel.color().hslString());

      View.editModel.color({h:100, s:0, l:100});

      console.log(View.editModel.color().hsl());
      console.log(View.editModel.color().hslString());

    });
  });
});
