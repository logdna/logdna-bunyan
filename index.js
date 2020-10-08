'use strict'

const {EventEmitter} = require('events')
const Logger = require('logdna').Logger
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
class BunyanStream extends EventEmitter {
  constructor(options) {
    super()
    this.logger = new Logger(options.key, {
      ...options
    , UserAgent: `${pkg.name}/${pkg.version}`
    })
  }

  write(record) {

    // LogDNA adds their own - lets assume the time delta is trivial
    // record['timestamp'] = record.time;

    var message = record.msg

    var opts = {
      level: levels[record.level]
    , app: record.name
    , context: {...record}
    , index_meta: true
    , hostname: record.hostname
    }
    // remove duplicate fields
    delete opts.context.level
    delete opts.context.timestamp
    delete opts.context.name
    delete opts.context.msg

    try {
      this.logger.log(message, opts)
    } catch (err) {
      this.emit('error', err)
    }
  };
}

module.exports.BunyanStream = BunyanStream
