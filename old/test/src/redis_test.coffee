Redis = require '../../src/redis'

describe 'Redis', ->
  it 'retuns a connected redis client', ->
    Redis.connected.should.be.true
    Redis.should.have.property('stream')
