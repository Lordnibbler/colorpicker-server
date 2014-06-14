describe('views/app.js', function() {

  var View;
  var color;

  beforeEach(function() {
    app.Colors.reset();
    // app.Colors.addFromHex('#ccccff');
    // color = app.Colors.first();
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

    it('', function() {

    });

  });

});
