<p align="center">
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-6-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/respectus"><img src="https://avatars.githubusercontent.com/u/1046364?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Muaz Siddiqui</b></sub></a><br /><a href="https://github.com/logdna/logdna-bunyan/commits?author=respectus" title="Code">💻</a> <a href="https://github.com/logdna/logdna-bunyan/commits?author=respectus" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/smusali"><img src="https://avatars.githubusercontent.com/u/34287490?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Samir Musali</b></sub></a><br /><a href="https://github.com/logdna/logdna-bunyan/commits?author=smusali" title="Code">💻</a> <a href="https://github.com/logdna/logdna-bunyan/commits?author=smusali" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/darinspivey"><img src="https://avatars.githubusercontent.com/u/1874788?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Darin Spivey</b></sub></a><br /><a href="https://github.com/logdna/logdna-bunyan/commits?author=darinspivey" title="Code">💻</a> <a href="https://github.com/logdna/logdna-bunyan/commits?author=darinspivey" title="Documentation">📖</a> <a href="#tool-darinspivey" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/vilyapilya"><img src="https://avatars.githubusercontent.com/u/17367511?v=4?s=100" width="100px;" alt=""/><br /><sub><b>vilyapilya</b></sub></a><br /><a href="https://github.com/logdna/logdna-bunyan/commits?author=vilyapilya" title="Code">💻</a> <a href="#tool-vilyapilya" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/s100"><img src="https://avatars.githubusercontent.com/u/9932290?v=4?s=100" width="100px;" alt=""/><br /><sub><b>s100</b></sub></a><br /><a href="https://github.com/logdna/logdna-bunyan/commits?author=s100" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/racbart"><img src="https://avatars.githubusercontent.com/u/26409542?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Bartek R.</b></sub></a><br /><a href="https://github.com/logdna/logdna-bunyan/commits?author=racbart" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!