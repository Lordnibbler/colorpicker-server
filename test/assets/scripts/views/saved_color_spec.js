describe('views/savedColor.js', function () {

  var SavedColorView = new app.SavedColorView({ color: '00adeb,983897', key: 'colorpicker:1' });

  describe('constructor', function() {
    it('sets defaults', function() {
      expect(SavedColorView.color).to.eql('00adeb,983897');
      expect(SavedColorView.key).to.eql('colorpicker:1');
    });
  });

  describe('render', function() {
    it('renders the template with color, spans, and key', function() {
      expect(SavedColorView.render()).to.eql('<li class="saved-color" data-color="00adeb,983897" data-key="colorpicker:1"><button class="destroy btn"><i class="fa fa-times fa-lg"></i></button><span style="background: #00adeb; height: 100%; width: 50%;"></span><span style="background: #983897; height: 100%; width: 50%;"></span></li>');
    });
  });

  describe('renderBackgroundSpans', function() {
    it('returns spans for each hex color in data-colors', function() {
      expect(SavedColorView.renderBackgroundSpans()).to.eql('<span style="background: #00adeb; height: 100%; width: 50%;"></span><span style="background: #983897; height: 100%; width: 50%;"></span>');
    });
  });

});
