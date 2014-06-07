Server = require '../../src/server'
config = require '../../src/config'

describe 'Server', ->
  describe '#run', ->
    it 'starts server successfully', (done) ->
      server = new Server(config.server.host, config.server.port).run(->
        true.should.equal(true)

        # close the server for next test
        server.close(done)
      )
