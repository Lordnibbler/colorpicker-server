describe('views/color_spec.js', function () {

  var View;
  var color;

  beforeEach(function() {
    app.Colors.reset();
    app.Colors.addFromHex('#00adeb');
    color = app.Colors.first();
    View = new app.ColorView({model: color});
  });

  describe('View', function() {
    it('has defaults', function() {
      expect(View.tagName).to.eql('li');
      expect(View.className).to.eql('swatch');
      expect(View.isIncrementing).to.eql(false);
    });
  });

  describe('events', function() {
    it('has the correct events', function() {
      expect(View.events['click .destroy']).to.eql('destroy');
      expect(View.events['click .meta-details']).to.eql('toggleDetails');
      expect(View.events['change .rgb .number-widget input']).to.eql('changeColorRgb');
      expect(View.events['change .hsl .number-widget input']).to.eql('changeColorHsl');
      expect(View.events['mousedown .number-widget .up']).to.eql('incrementValue');
      expect(View.events['mousedown .number-widget .down']).to.eql('decrementValue');
    });
  });

  describe('initialize', function() {
    it('binds to the change and destroy events of the model', function() {
      expect(View.model._events.change).to.not.eql(undefined);
      expect(View.model._events.destroy).to.not.eql(undefined);
      expect(View.model).to.eql(color);
    });
  });



});
