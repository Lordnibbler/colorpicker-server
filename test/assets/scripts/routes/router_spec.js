describe('Router', function() {

  var params = ['ffffff,00adeb,983897', null];

  beforeEach(function() {
    app.Colors.reset();
  });

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
      expect(app.Colors.setColors.getCall(0).args[0]).to.eql(colors);
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
      app.Colors.addFromHex('#983897');
    });

    it('invokes the collection\'s setGradientColors() method', function() {
      app.Router.setGradientColors(5);

      // ensure method was called, and with correct color string as an arg
      expect(app.Colors.setGradientColors.calledOnce).to.eql(true);
      expect(app.Colors.setGradientColors.getCall(0).args[0]).to.eql('983897');
      });

    afterEach(function() {
      // remove the sinon spy
      app.Colors.setGradientColors.restore();
    });
  });

  describe('setComplementaryColors()', function() {
    beforeEach(function() {
      // spy on setColors method so we can ensure it is called
      sinon.spy(app.Colors, 'setComplementaryColors');
      app.Colors.addFromHex('#00adeb');
    });


    it('picks first color in app.Colors and generates a ramp between them', function() {
      app.Router.setComplementaryColors();
      expect(app.Colors.setComplementaryColors.calledOnce).to.eql(true);
    });

    afterEach(function() {
      // remove the sinon spy
      app.Colors.setComplementaryColors.restore();
    });
  });

  describe('setHueShiftComplementaryColors()', function() {
    beforeEach(function() {
      // spy on setColors method so we can ensure it is called
      sinon.spy(app.Colors, 'setHueShiftComplementaryColors');
      app.Colors.addFromHex('#00adeb');
    });


    it('picks first color in app.Colors and generates a ramp between them', function() {
      app.Router.setHueShiftComplementaryColors();
      expect(app.Colors.setHueShiftComplementaryColors.calledOnce).to.eql(true);
    });

    afterEach(function() {
      // remove the sinon spy
      app.Colors.setHueShiftComplementaryColors.restore();
    });
  });

  describe('pushColorState()', function() {
    beforeEach(function() {
      for(var i = 0; i < 3; i++) app.Colors.addFromHex('#00adeb');

      // spy on methods so we can ensure they're called
      sinon.spy(app.Router, 'emitColorSet');
      sinon.spy(app.Router, 'navigate');
    });

    it('invokes emitColorSet once, and pushes the current Colors state to the path', function() {
      app.Router.pushColorState();

      expect(app.Router.emitColorSet.calledOnce).to.eql(true);
      expect(app.Router.navigate.calledOnce).to.eql(true);
      expect(app.Router.navigate.getCall(0).args[0]).to.eql('00ADEB,00ADEB,00ADEB,');
      expect(app.Router.navigate.getCall(0).args[1]).to.eql({trigger: false, replace: true});
    });

    afterEach(function() {
      app.Router.emitColorSet.restore();
      app.Router.navigate.restore();
    });
  });

  describe('emitColorSet()', function() {
    beforeEach(function () {
      window.socket = {
        emit: function(key, object) {
          return true;
        }
      };
      app.Colors.addFromHex('#983897');
      sinon.spy(window.socket, 'emit');
    });

    it('invokes the window.socket.emit() method', function() {
      app.Router
        .emitColorSet('000,000,000,000\n000,000,000,000\n000,000,000,000\n000,000,000,000\n000,000,000,000');

      expect(window.socket.emit.calledOnce).to.eql(true);
      expect(window.socket.emit.getCall(0).args[1]).to.eql({
        color: '000,000,000,000\n000,000,000,000\n000,000,000,000\n000,000,000,000\n000,000,000,000'
      })
    });

    afterEach(function() {
      window.socket.emit.restore();
    });
  });

  describe('clearColors()', function() {
    beforeEach(function() {
      for(var i = 0; i < 3; i++) app.Colors.addFromHex('#00adeb');

      // spy on methods so we can ensure they're called
      sinon.spy(app.Router, 'emitColorSet');
      sinon.spy(app.Router, 'navigate');
      sinon.spy(app.Colors, 'reset');
    });

    it('invokes the clear methods, and navigates to no colors', function() {
      app.Router.clearColors();

      expect(app.Colors.reset.calledOnce).to.be.true;

      expect(app.Router.navigate.calledOnce).to.eql(true);
      expect(app.Router.navigate.getCall(0).args[0]).to.eql('');
      expect(app.Router.navigate.getCall(0).args[1]).to.eql({trigger: false, replace: true});

      expect(app.Router.emitColorSet.calledTwice).to.eql(true);
      expect(app.Router.emitColorSet.getCall(1).args[0]).to
        .eql('000,000,000,000\n000,000,000,000\n000,000,000,000\n000,000,000,000\n000,000,000,000\n');
    });

    afterEach(function() {
      app.Router.emitColorSet.restore();
      app.Router.navigate.restore();
      app.Colors.reset.restore();
    });
  });

  describe('setWhiteColors()', function() {
    beforeEach(function() {
      sinon.spy(app.Router, 'setColors');

      window.socket = {
        emit: function(key, object) {
          return true;
        }
      };
      sinon.spy(window.socket, 'emit');
    });

    it('invokes the clear methods, and navigates to no colors', function() {
      app.Router.setWhiteColors();
      expect(app.Router.setColors.calledOnce).to.eql(true);
      expect(app.Router.setColors.getCall(0).args[0]).to.eql('FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF');

      expect(window.socket.emit.calledOnce).to.be.true;
      expect(window.socket.emit.getCall(0).args[0]).to.eql('colorSet');
      expect(window.socket.emit.getCall(0).args[1].color)
        .to.eql('255,255,255,000\n255,255,255,000\n255,255,255,000\n255,255,255,000\n255,255,255,000\n');
    });

    afterEach(function() {
      app.Router.setColors.restore();
      window.socket.emit.restore();
    });
  });

});
