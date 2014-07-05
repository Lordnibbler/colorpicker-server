Redis = require '../../src/redis'
Color = require '../../src/color'
color = undefined

describe 'Color', ->
  describe 'instance methods', ->
    beforeEach ->
      color = new Color(Redis, 0)

    describe 'constructor', ->
      it 'creates some defaults', ->
        color.KEY_PREFIX.should.eql 'colorpicker:'
        color.redis.should.not.be.undefined
        color.key_expire_seconds.should.eql(0)
        color.key.should.not.be.undefined

    describe 'create', ->
      it 'inserts a new key/value pair', ->
        # TODO create returns ID, so try fetching it after insert success
        color.create('00adeb,983897')
          .then (res) ->
            res.should.be.greaterThan 0

  describe 'class methods', ->
    describe 'index', ->
