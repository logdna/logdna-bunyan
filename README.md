<p align="center">
  <a href="https://app.logdna.com">
    <img height="95" width="201" src="https://raw.githubusercontent.com/logdna/artwork/master/logo%2Bnode.png">
  </a>
  <p align="center">Node.js Bunyan library for logging to <a href="https://app.logdna.com">LogDNA</a></p>
</p>

---

* **[Install](#install)**
* **[API](#api)**
* **[Logging to LogDNA Through Bunyan](#logging-to-logdna-through-bunyan)**
* **[License](#license)**


## Install

```sh
$ npm install --save logdna-bunyan
```

## API

Please see [@logdna/logger](https://www.npmjs.com/package/@logdna/logger#createloggerkey-options) for
instantiation options to passthrough to LogDNA's logger client.

## Logging to LogDNA Through Bunyan

This module provides an interface that can be hooked into Bunyan and used as a
transport to LogDNA. Since `@logdna/logger` is also an `EventEmitter`, please make use
of the [`reemitErrorEvents`](https://github.com/trentm/node-bunyan/tree/a72af248b57a908a5d39e72b7e9efed7b24e5808#stream-errors)
provided by Bunyan so that the implementor can be aware of errors in the LogDNA client.
Not doing so will cause Bunyan to throw if `@logdna/logger` emits an `'error'`.

```javascript
const {createLogger} = require('bunyan')
const LogDNAStream = require('logdna-bunyan')

const logDNA = new LogDNAStream({
  key: apikey
}) // See @logdna/logger for more constructor options

const logger = createLogger({
  name: "My Application"
, streams: [
    {
      stream: process.stdout
    }
  , {
      stream: logDNA
    , type: 'raw'
    , reemitErrorEvents: true // Bubble up 'error' events from @logdna/logger
    }
  ]
})

logger.info('Starting application on port %d', app.get('port'))
```

*NOTE*: You _must_ use the `raw` stream type, and also `reemitErrorEvents` _must_ be
`true`.  Otherwise, errors emitted by `@logdna/logger` will throw Bunyan.

## License

Copyright © [LogDNA](https://logdna.com), released under an MIT license.
See the [LICENSE](./LICENSE) file and https://opensource.org/licenses/MIT

*Happy Logging!*
