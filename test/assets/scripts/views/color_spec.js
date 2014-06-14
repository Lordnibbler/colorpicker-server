describe('views/color_spec.js', function () {

  var View;
  var color;

  beforeEach(function() {
    app.Colors.reset();
    app.Colors.addFromHex('#ccccff');
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

  describe('render', function() {
    beforeEach(function() {
      View.render();
    });

    it('has the correct nodeName', function() {
      expect(View.el.nodeName).to.eql('LI');
    });

    it('has the correct template rendered', function() {
      expect(View.$el.find('.color')).to.have.length(1);
      expect(View.$el.find('.details')).to.have.length(1);
      expect(View.$el.find('.color .info .rgb h2').text()).to.eql('#CCCCFF');
    });

    it('sets correct background CSS', function() {
      expect(View.$el.find('.color').css('backgroundColor')).to.eql(View.model.color().rgbString());
    });

    it('adds CSS class .light if color\'s lightness > 50', function() {
      expect(View.model.color().lightness()).to.be.above(50);
      expect(View.$el.attr('class')).to.match(/light/i);
    });
  });

  describe('destroy', function() {
    it('destroys the model', function() {
      expect(app.Colors.length).to.eql(1);
      View.destroy();
      expect(app.Colors.length).to.eql(0);
    });
  });

  describe('setupRemove', function() {
    it('sets the css class', function() {
      expect(View.$el.attr('class')).to.not.match(/destroyed/i);
      View.setupRemove();
      expect(View.$el.attr('class')).to.match(/destroyed/i);
    });
  });

  describe('toggleDetails', function() {
    it('sets the css class', function() {
      View.toggleDetails();
      expect(View.$el.attr('class')).to.match(/show-details/i);
      View.toggleDetails();
      expect(View.$el.attr('class')).to.not.match(/show-details/i);
    });
  });

});
