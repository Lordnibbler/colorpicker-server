describe('Color model', function(){

  it('should have certain defaults', function(){
    var color = new app.Color('#00ADEB');
    expect(color.hexCss()).toBe('#00ADEB');
  });
});
