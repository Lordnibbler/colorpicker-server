describe('Color model', function() {

  describe('constructor', function() {
    it('should have a Color object as a default', function() {
      var color = new app.Color();
      expect(color.color()).toBeDefined();
    });
  });

  describe('color()', function() {
    it('sets and gets an existing color', function() {
      var color = new app.Color({color: new Color('#00adeb')});
      expect(color.color()).toBeDefined();
      expect(color.color().values.rgb).toEqual([0, 173, 235]);
      expect(color.color().rgb()).toEqual({r: 0, g: 173, b: 235});
    });
  });

  describe('rgbCss()', function() {
    it('returns the same RGB code it was instantiated with', function() {
      var color = new app.Color({color: new Color({r: 100, g: 50, b: 75})});
      expect(color.rgbCss()).toBe('rgb(100, 50, 75)');
    })
  });

  describe('hslCss()', function() {
    it('returns the same HSL code it was instantiated with', function() {
      var color = new app.Color({color: new Color({h: 196, s: 100, l: 46})});
      expect(color.hslCss()).toBe('hsl(196, 100%, 46%)');
    })
  });

  describe('hexCss()', function() {
    it('returns the same hex code it was instantiated with', function() {
      var color = new app.Color({color: new Color('#00adeb')});
      expect(color.hexCss()).toBe('#00ADEB');
    })
  });

  describe('rgb()', function() {
    it('returns an rgba object, with values padded with 0\'s', function() {
      var color = new app.Color({color: new Color('#983897')});
      expect(color.rgb()).toEqual({ r: '152', g: '056', b: '151', a: '000' })
    });
  });

  describe('bitwiseComplement()', function() {
    it('returns the bitwise complement padded with 0\'s', function() {
      var color = new app.Color({color: new Color('#ff0000')});
      expect(color.bitwiseComplement()).toEqual('00ffff')
    });
  });

});
