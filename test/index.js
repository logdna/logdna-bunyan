'use strict'

const LogDNAStream = require('../index.js')
const {test} = require('tap')
const nock = require('nock')
const bunyan = require('bunyan')

nock.disableNetConnect()

test('Test all "level" convenience methods', (t) => {
  const name = 'My Application'
  const options = {
    key: 'abc123'
  , hostname: 'My-Host'
  , ip: '192.168.2.100'
  , mac: '9e:a0:f8:20:86:3d'
  , url: 'http://localhost:35870'
  , app: 'LogDNA'
  }

  const logger = bunyan.createLogger({
    name
  , level: 0
  , streams: [
      {
        stream: new LogDNAStream({
          ...options
        , flushLimit: 1 // Force individual POSTs instead of one array for all
        })
      , type: 'raw'
      }
    ]
  })
  const msg = 'Log from LogDNA-winston'

  t.plan(12)
  t.on('end', async () => {
    nock.cleanAll()
  })

  nock(options.url)
    .post('/', (body) => {
      const payload = body.ls[0]
      t.match(payload, {
        timestamp: Number
      , line: msg
      , level: /^TRACE|DEBUG|INFO|WARN|ERROR|FATAL$/
      , app: name
      , meta: {
          pid: Number
        , time: String
        , v: Number
        , hostname: String
        }
      }, `Payload correct for ${payload.level}`)
      return true
    })
    .query((q) => {
      t.match(q, {
        now: /^\d+$/
      , hostname: 'My-Host'
      , mac: '9e:a0:f8:20:86:3d'
      , ip: '192.168.2.100'
      , tags: ''
      }, 'LogDNA logger query string is correct')
      return true
    })
    .reply(200, 'Ingester response')
    .persist()

  logger.trace(msg)
  logger.debug(msg)
  logger.info(msg)
  logger.warn(msg)
  logger.error(msg)
  logger.fatal(msg)

})

test('.info() with an object', (t) => {
  const name = 'My Application'
  const options = {
    key: 'abc123'
  , hostname: 'My-Host'
  , ip: '192.168.2.100'
  , mac: '9e:a0:f8:20:86:3d'
  , url: 'http://localhost:35870'
  , app: 'LogDNA'
  }

  const logger = bunyan.createLogger({
    name
  , streams: [
      {
        stream: new LogDNAStream(options)
      , type: 'raw'
      }
    ]
  })
  const msg = 'Log from LogDNA-winston'

  const meta = {
    data: 'Some meta information'
  , bool: true
  , num: 3587
  }

  t.plan(2)
  t.on('end', async () => {
    nock.cleanAll()
  })

  nock(options.url)
    .post('/', (body) => {
      const payload = body.ls[0]
      t.match(payload, {
        timestamp: Number
      , line: msg
      , level: 'INFO'
      , app: name
      , meta: {
          ...meta
        , pid: Number
        , time: String
        , v: Number
        , hostname: String
        }
      }, 'LogDNA logger payload is correct')
      return true
    })
    .query((q) => {
      t.match(q, {
        now: /^\d+$/
      , hostname: 'My-Host'
      , mac: '9e:a0:f8:20:86:3d'
      , ip: '192.168.2.100'
      , tags: ''
      }, 'LogDNA logger query string is correct')
      return true
    })
    .reply(200, 'Ingester response')

  logger.info({
    data: meta.data
  , bool: meta.bool
  , num: meta.num
  }, msg)
})

test('Error is logged correctly', (t) => {
  const name = 'My Application'
  const options = {
    key: 'abc123'
  , hostname: 'My-Host'
  , ip: '192.168.2.100'
  , mac: '9e:a0:f8:20:86:3d'
  , url: 'http://localhost:35870'
  , app: 'LogDNA'
  }

  const logger = bunyan.createLogger({
    name
  , streams: [
      {
        stream: new LogDNAStream(options)
      , type: 'raw'
      }
    ]
  })
  const err = new Error('BOOM, A FAKE ERROR')

  t.plan(2)
  t.on('end', async () => {
    nock.cleanAll()
  })

  nock(options.url)
    .post('/', (body) => {
      const payload = body.ls[0]
      t.match(payload, {
        timestamp: Number
      , line: err.message
      , level: 'ERROR'
      , app: name
      , meta: {
          err: {
            name: 'Error'
          , message: err.message
          , stack: err.stack
          }
        , pid: Number
        , time: String
        , v: Number
        , hostname: String
        }
      }, 'LogDNA logger payload is correct')
      return true
    })
    .query((q) => {
      t.match(q, {
        now: /^\d+$/
      , hostname: 'My-Host'
      , mac: '9e:a0:f8:20:86:3d'
      , ip: '192.168.2.100'
      , tags: ''
      }, 'LogDNA logger query string is correct')
      return true
    })
    .reply(200, 'Ingester response')

  logger.error(err)
})

test('Errors emitted by @logdna/logger are bubbled up to bunyan', (t) => {
  const name = 'My Application'
  const options = {
    key: 'abc123'
  , hostname: 'My-Host'
  , ip: '192.168.2.100'
  , mac: '9e:a0:f8:20:86:3d'
  , url: 'http://localhost:35870'
  , app: 'LogDNA'
  }
  const plugin = new LogDNAStream(options)
  const logger = bunyan.createLogger({
    name
  , streams: [
      {
        stream: plugin
      , type: 'raw'
      , reemitErrorEvents: true
      }
    ]
  })

  t.plan(2)

  logger.on('error', (err) => {
    t.type(err, Error, 'Got error')
    t.equal(err.message, 'FAKE ERROR', 'Error message is as expected')
  })

  const error = new Error('FAKE ERROR')

  plugin.logger.emit('error', error)
})
