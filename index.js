'use strict'

const {EventEmitter} = require('events')
const {createLogger} = require('@logdna/logger')
const pkg = require('./package.json')

// Constants
const levels = {
  10: 'TRACE'
, 20: 'DEBUG'
, 30: 'INFO'
, 40: 'WARN'
, 50: 'ERROR'
, 60: 'FATAL'
}

/*
 *  Support for Bunyan Transport
 */
class LogDNAStream extends EventEmitter {
  constructor(options) {
    super()
    this.logger = createLogger(options.key, {
      ...options
    , indexMeta: true
    , UserAgent: `${pkg.name}/${pkg.version}`
    })

    this.logger.on('error', (err) => {
      this.emit('error', err)
    })
  }

  write(record) {

    const {
      msg: message
    , level
    , name: app
    , hostname
    , timestamp // Bunyan provides timestamp, so just use that for LogDNA's time as well
    , ...meta
    } = record

    const opts = {
      level: levels[level]
    , app
    , meta: {
        ...meta
      , hostname
      }
    , timestamp
    }

    this.logger.log(message, opts)
  };
}

module.exports = LogDNAStream
