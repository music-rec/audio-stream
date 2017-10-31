'use strict';

const Server = require('./server');

const path = require('path');

// get the config
const file = path.resolve(process.argv[2]); // arg to absolute path
const config = require(file); // merge config file

// create a new server
const server = new Server(config);

server.start();

