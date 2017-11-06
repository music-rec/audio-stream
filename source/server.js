'use strict';

const express = require('express');
const path = require('path');

// manages the express server -- the backend
class Server {
  constructor (manager, logo) {
    this.app = express();

    this.manager = manager;

    // define view engine and endpoints
    this.app.set('view engine', 'pug');

    this.app.use('/static', express.static(path.join(__dirname, 'static')));

    // render index with config logo and streams
    this.app.get('/', (request, response) => {
      response.render('index', {
        logo: logo || null,
        streams: this.manager.streams || []
      });
    });

    this.app.get('/stream/:uid', (request, response) => {
      response.contentType('application/ogg');

      console.log('test');
      console.log(request.accepts('application/ogg'));

      if (request.accepts('application/ogg'))
        this.manager.stream(request.params.uid, response);
      else
        response.send('');
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
