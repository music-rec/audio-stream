'use strict';

const express = require('express');
const path = require('path');

// manages the express server -- the backend
class Server {
  constructor (manager, config) {
    this.app = express();

    // define view engine and endpoints
    this.app.set('view engine', 'pug');

    this.app.use('/static', express.static(path.join(__dirname, 'static')));

    // render index with config logo and streams
    this.app.get('/', (request, response) => {
      response.render('index', {
        logo: config.logo || null,
        streams: manager.streams || []
      });
    });

    // stream from re-encoded stream
    this.app.get('/stream/:uid', (request, response) => {
      manager.streams[request.params.uid].pipe(response);
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
