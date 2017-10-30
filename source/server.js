'use strict';

const express = require('express');

class Server {
  constructor () {
    this.app = express();
    
    this.app.use(express.static('./static'));
  }

  start () {
    this.app.listen(3000, () => {
      console.log('Listening on port 3000');
    })
  }
}

module.exports = Server;
