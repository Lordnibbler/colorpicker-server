describe('SavedColor model', function() {

  describe('constructor', function() {
    it('has default attributes', function() {
      var savedColor = new app.SavedColor({ color: '00adeb', key: 'colorpicker:1' });
      expect(savedColor.urlRoot).to.eql('api/v1/colors');
      expect(savedColor.attributes.color).to.eql('00adeb');
      expect(savedColor.attributes.key).to.eql('colorpicker:1');
    });
  });

  describe('url', function() {
    it('returns the urlRoot if key not set, or this.currentAction === "delete"', function() {
      expect(new app.SavedColor().url()).to.eql('api/v1/colors');
    });

    it('returns RESTful API endpoint with :id if key and currentAction are set', function() {
      var savedColor = new app.SavedColor({ key: 'colorpicker:1' });
      savedColor.currentAction = 'delete';
      expect(savedColor.url()).to.eql('api/v1/colors/colorpicker:1');
    })
  });

  describe('sync', function() {
    it('sets the models currentAction appropriately', function() {
      var savedColor = new app.SavedColor({ color: '00adeb', key: 'colorpicker:1' });
      savedColor.sync('delete', savedColor, {});
      expect(savedColor.currentAction).to.eql('delete');
    });
  });

});
