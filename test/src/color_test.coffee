Redis = require '../../src/redis'
Color = require '../../src/color'

describe 'Color', ->
  describe 'create', ->
    before (done) ->
      Color.destroy_all().then(done())

    it 'inserts a new key/value pair', (done) ->
      response = undefined
      Color.create('00adeb,983897')
        .then (res) ->
          response = res
          res.should.match /colorpicker\:\d+/
          Color.show(response)
            .then (res) ->
              res.should.eql('00adeb,983897')
              done()

  describe 'index', ->
    key = undefined

    before (done) ->
      Color.destroy_all().then(done())

    before (done) ->
      Color.create('00adeb,983897')
        .then (res) ->
          key = res
          done()

    before (done) ->
      Color.create('00ffff,ffff00')
        .then (res) ->
          key = res
          done()

    it 'retrieves all key value pairs in redis', (done) ->
      Color.index()
        .then (res) ->
          # ensure we have > 1 color key in the response
          Object.keys(res).length.should.be.greaterThan(1)
          for k, v of res
            k.should.match /colorpicker\:\d+/
            v.should.match /[A-Fa-f0-9]{6}\,/
          done()

  describe 'show', ->
    key = undefined

    before (done) ->
      Color.destroy_all().then(done())

    before (done) ->
      Color.create('00adeb,983897')
        .then (res) ->
          key = res
          done()

    it 'gets a value of a key', (done) ->
      Color.show(key)
        .then (res) ->
          res.should.eql('00adeb,983897')
          done()

  describe 'destroy', ->
    key = undefined

    before (done) ->
      Color.destroy_all().then(done())

    beforeEach (done) ->
      Color.create('00adeb,983897')
        .then (res) ->
          key = res
          done()

    it 'destroys a key', (done) ->
      Color.destroy(key)
        .then (res) ->
          Color.show(key)
            .then (res) ->
              (res == null).should.eql(true)
            .done done()

  describe 'destroy_all', ->
    key = undefined

    before (done) ->
      Color.destroy_all().then(done())

    before (done) ->
      Color.create('00adeb,983897')
        .then (res) ->
          key = res
          done()

    before (done) ->
      Color.create('00ffff,ffff00')
        .then (res) ->
          key = res
          done()

    it 'destroys all keys with the KEY_PREFIX', (done) ->
      Color.destroy_all()
        .then (res) ->
          res.should.eql(2)
          done()
