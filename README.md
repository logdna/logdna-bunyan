<p align="center">
  <a href="https://app.logdna.com">
    <img height="95" width="201" src="https://raw.githubusercontent.com/logdna/artwork/master/logo%2Bnode.png">
  </a>
  <p align="center">Node.js Bunyan library for logging to <a href="https://app.logdna.com">LogDNA</a></p>
</p>

---

* **[Install](#install)**
* **[API](#api)**
* **[Bunyan Stream](#bunyan-stream)**
* **[License](#license)**


## Install

```javascript
$ npm install --save logdna-bunyan
```

## API

Please see the [logdna](https://github.com/logdna/nodejs/) npm module for the API.

## Bunyan Stream

This module also provides a transport object, which can be added to bunyan using:

```javascript
let LogDNAStream = require('logdna-bunyan').BunyanStream;

let logDNA = new LogDNAStream({
  key: apikey
});

var logger = bunyan.createLogger({
  name: "My Application",
  streams: [
  	{ stream: process.stdout },
    { stream: logDNA,
      type: 'raw'
    }
  ]
});


logger.info('Starting application on port %d', app.get('port'));
```

*NOTE*: You _must_ use the `raw` stream type

## License

MIT © [LogDNA](https://logdna.com/)

*Happy Logging!*
