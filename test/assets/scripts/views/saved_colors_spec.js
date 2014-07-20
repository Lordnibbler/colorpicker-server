describe('views/savedColors.js', function() {


  describe('constructor', function() {
    beforeEach(function() {
      app.SavedColors.reset();
    });

    it('invokes the initialize method', function() {
      var spy = sinon.spy(app, 'SavedColorsView');
      var SavedColorsView = new app.SavedColorsView();
      expect(spy.callCount).to.eql(1);
    });

    describe('fetching', function() {
      before(function() {
        sinon
          .stub(app.SavedColors, 'fetch')
          .yieldsTo('success', [''], [ { "colorpicker:123": '00ADEB,983897' } ]);
      });

      it('adds a new SavedColorView for each color in the JSON response body', function() {
        // immediately call the success method
        var SavedColorsView = new app.SavedColorsView({ el: '<ul id="saved-colors"></ul>' });
        expect(app.SavedColors.fetch.callCount).to.eql(1);
        expect(SavedColorsView.$el.find('li').length).to.eql(1);
      });

      after(function() {
        app.SavedColors.fetch.restore();
      });
    });

  });

  describe('addOne', function() {
    it('instantiates and appends a SavedColorView to DOM', function() {
      var SavedColorsView = new app.SavedColorsView({ el: '<ul id="saved-colors"></ul>' });
      SavedColorsView.addOne({ "colorpicker:123": "00ADEB,983897" });

      // check <li>
      expect(SavedColorsView.$el.find('li.saved-color').length).to.eql(1);
      expect(SavedColorsView.$el.find('li.saved-color').data('color')).to.eql('00ADEB,983897');

      // check color <span>
      expect(SavedColorsView.$el.find('li span').first().css('background')).to.eql('rgb(0, 173, 235)');
      expect(SavedColorsView.$el.find('li span').first().css('height')).to.eql('100%');
      expect(SavedColorsView.$el.find('li span').first().css('width')).to.eql('50%');
    });
  });

  describe('clicked', function() {
    it('invokes the routers setColors method', function() {
      sinon.spy(app.Router, 'setColors');
      var SavedColorsView = new app.SavedColorsView({ el: '<ul id="saved-colors"></ul>' });
      SavedColorsView.clicked({ currentTarget: $('<li class="saved-color" data-color="983897,00ADEB"></li>') });
      expect(app.Router.setColors.callCount).to.eql(1);
      expect(app.Router.setColors.getCall(0).args[0]).to.eql('983897,00ADEB');
      app.Router.setColors.restore();
    });
  });

  describe('destroyClicked', function() {
    it('removes the li.saved-color element', function() {
      sinon.stub(app.SavedColor.destroy).yieldsTo('success');
      var SavedColorsView = new app.SavedColorsView({
        el: '<ul id="saved-colors"><li class="saved-color" data-color="983897,00ADEB"><span></span></li></ul>'
      });

      expect(SavedColorsView.$el.find('li').length).to.eql(1);
      SavedColorsView.destroyClicked({
        currentTarget: SavedColorsView.$el.find('li span'),
        preventDefault: function() { return true; },
        stopPropagation: function() { return true; }
      });
      expect(SavedColorsView.$el.find('li').length).to.eql(0);
      expect(SavedColorsView.$el.find('li span').length).to.eql(0);
    });
  });
});
