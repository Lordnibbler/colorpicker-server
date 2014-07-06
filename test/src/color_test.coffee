Redis = require '../../src/redis'
Color = require '../../src/color'

describe 'Color', ->
  describe 'create', ->
    it 'inserts a new key/value pair', (done) ->
      # TODO create returns ID like 'colorpicker:41'
      # so try fetching it after insert success
      Color.create('00adeb,983897')
        .then (res) ->
          res.should.match /colorpicker\:\d+/
        .done ->
          done()

  describe 'index', ->
    key = undefined
    beforeEach (done) ->
      Color.create('00adeb,983897')
        .then (res) ->
          key = res
          done()

    beforeEach (done) ->
      Color.create('00ffff,ffff00')
        .then (res) ->
          key = res
          done()

    afterEach (done) ->
      Color.destroy_all()
        .then (res) ->
          done()

    it 'retrieves all key value pairs in redis', (done) ->
      Color.index()
        .then (res) ->
          # ensure we have > 1 color key in the response
          Object.keys(res).length.should.be.greaterThan(1)
          for k, v of res
            k.should.match /colorpicker\:\d+/
            v.should.match /[A-Fa-f0-9]{6}\,/
        .done ->
          done()
