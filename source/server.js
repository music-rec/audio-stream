'use strict';

const express = require('express');
const path = require('path');

// manages the express server -- the backend
class Server {
  constructor (manager, config) {
    this.app = express();

    // define view engine and endpoints
    this.app.set('port', process.env.PORT || 5000);
    this.app.set('view engine', 'pug');
    this.app.settings['x-powered-by'] = false;

    // serve static files to client
    this.app.use('/static', express.static(path.join(__dirname, 'static')));

    // render index with config logo and streams
    this.app.get('/', (request, response) => {
      response.render('index', {
        logo: config.logo || null,
        streams: manager.streams || []
      });
    });

    // stream from re-encoded stream
    this.app.get('/stream/:uid', (request, response, next) => {
      request.on('close', next);

      manager.streams[request.params.uid].connect();
      manager.streams[request.params.uid].pipe(response);
    }, (request, response) => {
      manager.streams[request.params.uid].disconnect();
    });
  }

  // start the server
  start () {
    this.server = this.app.listen(this.app.get('port'), () => {
      console.log(`Listening on :${this.app.get('port')}`);
    });
  }

  stop () {
    this.server.close();
  }
}

module.exports = Server;
