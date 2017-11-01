'use strict';

const express = require('express');
const path = require('path');

// manages the express server -- the backend
class Server {
  constructor (manager, logo) {
    this.app = express();
    this.server = require('http').createServer(this.app);
    this.io = require('socket.io')(this.server);

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

    this.io.on('connection', socket => {
      socket.on('request stream', uid => {
        console.log(this.manager.streams[uid].source); // TODO: actually stream it
      })
    });
  }

  // start the server
  start () {
    this.server.listen(3000, () => {
      console.log('Listening on port 3000');
    });
  }
}

module.exports = Server;
