describe('Color model', function() {
  beforeEach(function() {
    // empty the collection before each test
    app.Colors.reset();
  });

  describe('global', function() {
    it('has the global Colors collection defined', function() {
      expect(app.Colors).toBeDefined();
    });
  });

  describe('addFromHex()', function () {
    it('adds a color model from hex', function() {
      expect(app.Colors.length).toBe(0);
      app.Colors.addFromHex('#00adeb');
      expect(app.Colors.length).toBe(1);
    });

    it('adds a color model at a specific index from hex', function() {
      // add all white, and one blue at index: 1
      for (var i = 0; i < 3; i++) app.Colors.addFromHex('#ffffff');
      app.Colors.addFromHex('#00adeb', 1);

      // assert that collection[0] is the blue color
      expect(app.Colors.at(1).hexCss()).toMatch(/#00adeb/i);
    });
  });

  describe('toRgbString()', function () {
    it('returns a string in Halo.pl expected rgba format', function() {
      app.Colors.addFromHex('#00adeb');
      app.Colors.addFromHex('#983897');
      expect(app.Colors.toRgbString()).toBe('000,173,235,000\n152,056,151,000\n');
    });
  });

  describe('generateComplementaryColors()', function () {
    it('', function() {

    });
  });

  describe('generateHueShiftComplementaryColors()', function () {
    it('', function() {

    });
  });


});
