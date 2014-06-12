describe('Color model', function() {

  beforeEach(function() {

  });

  describe('routes', function() {
    var params = ['ffffff,00adeb,983897', null];

    describe('*colors', function() {
      it('routes to setColors() method with globbed params from the URL', function() {
        ("#ffffff,00adeb,983897").should.route.to(app.Router, "setColors", { arguments: params });
      });
    });

    describe('setColors()', function() {
      beforeEach(function() {
        // spy on setColors method so we can ensure it is called
        sinon.spy(app.Colors, 'setColors');
      });

      it('invokes the collection\'s setColors() method', function() {
        // invoke the method
        var colors = '00ADEB,00ED79,34EF00,EDF200,F43A00,';
        app.Router.setColors(colors);

        // ensure method was called, and with correct color string as an arg
        expect(app.Colors.setColors.calledOnce).to.eql(true);
        expect(app.Colors.setColors.getCall(0).args[0]).to.eql(colors.split(','));
      });

      afterEach(function() {
        // remove the sinon spy
        app.Colors.setColors.restore();
      });
    });

    describe('setGradientColors()', function() {
      beforeEach(function() {
        // spy on setColors method so we can ensure it is called
        sinon.spy(app.Colors, 'setGradientColors');
      });

      it('invokes the collection\'s setGradientColors() method', function() {
        app.Router.setGradientColors('00adeb', 5);

        // ensure method was called, and with correct color string as an arg
        expect(app.Colors.setGradientColors.calledOnce).to.eql(true);
        expect(app.Colors.setGradientColors.getCall(0).args[0]).to.eql('00adeb');
        expect(app.Colors.setGradientColors.getCall(0).args[1]).to.eql(5);
        });

      afterEach(function() {
        // remove the sinon spy
        app.Colors.setGradientColors.restore();
      });
    });

    describe('setComplementaryColors()', function() {
      beforeEach(function() {
        // spy on setColors method so we can ensure it is called
        sinon.spy(app.Colors, 'generateComplementaryColors');
      });


      it('picks first color in app.Colors and generates a ramp between them', function() {
        app.Colors.addFromHex('#00adeb');
        app.Router.setComplementaryColors();
        expect(app.Colors.generateComplementaryColors.calledOnce).to.eql(true);
      });

      afterEach(function() {
        // remove the sinon spy
        app.Colors.generateComplementaryColors.restore();
      });
    });

  });

});
