describe('Color model', function() {

  beforeEach(function() {
    // empty the collection before each test
    app.Colors.reset();
  });

  describe('global', function() {
    it('has the global Colors collection defined', function() {
      expect(app.Colors).to.not.equal(undefined);
    });
  });

  describe('addFromHex()', function () {
    it('adds a color model from hex', function() {
      expect(app.Colors.length).to.eql(0);
      app.Colors.addFromHex('#00adeb');
      expect(app.Colors.length).to.eql(1);
    });

    it('adds a color model at a specific index from hex', function() {
      // add all white, and one blue at index: 1
      for (var i = 0; i < 3; i++) app.Colors.addFromHex('#ffffff');
      app.Colors.addFromHex('#00adeb', 1);

      // assert that collection[0] is the blue color
      expect(app.Colors.at(1).hexCss()).to.match(/#00adeb/i);
    });
  });

  describe('toRgbString()', function () {
    it('returns a string in Halo.pl expected rgba format', function() {
      app.Colors.addFromHex('#00adeb');
      app.Colors.addFromHex('#983897');
      expect(app.Colors.toRgbString()).to.eql('000,173,235,000\n152,056,151,000\n');
    });
  });

  describe('generateComplementaryColors()', function () {
    it('generates a rainbowvis.js spectrum between color and its complement', function() {
      app.Colors.addFromHex('#00adeb');
      app.Colors.generateComplementaryColors(5);
      var colors = { 0: '#00ADEB', 1: '#4096B5', 2: '#808080', 3: '#BF694A', 4: '#FF5214' }
      for (var i = 0; i < colors.length; i++) expect(app.Colors.at(i).hexCss()).to.eql(colors[i]);
    });
  });

  describe('generateHueShiftComplementaryColors()', function () {
    it('generates a hue-complement spectrum between color and its complement', function() {
      app.Colors.addFromHex('#00adeb');
      app.Colors.generateHueShiftComplementaryColors(5);
      var colors = { 0: '#00ADEB', 1: '#00ED79', 2: '#34EF00', 3: '#EDF200', 4: '#F43A00' }
      for (var i = 0; i < colors.length; i++) expect(app.Colors.at(i).hexCss()).to.eql(colors[i]);
    });
  });

});
