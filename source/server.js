'use strict';

const crypto = require('crypto');
const express = require('express');
const path = require('path');

// get sha256 in hex string
const hash = string => {
  const f = crypto.createHash('sha256');

  f.update(string);
  return f.digest('hex')
}

// manages the express server -- the backend
class Server {
  constructor (config) {
    this.app = express();
    this.config = config || {};
    this.parameters = {};

    // create a dictonary of hashed sources
    this.sources = {};
    for (let stream of this.config.streams || [])
      this.sources[hash(stream.source)] = stream.source;

    // set parameters with hashed sources
    this.parameters.logo = this.config.logo || null;
    this.parameters.streams = this.config.streams || [];
    for (let stream of this.parameters.streams)
      stream.source = hash(stream.source);

    console.log(this.parameters);

    // define view engine a endpoints
    this.app.set('view engine', 'pug');
    this.app.use('/static', express.static('./static'));
    this.app.get('/', (request, response) => {
      response.render('index', this.parameters);
    });
  }

  // start the server
  start () {
    this.app.listen(3000, () => {
      console.log('Listening on port 3000');
    });
  }
}

module.exports = Server;
