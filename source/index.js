'use strict';

import 'source-map-support/register';

const Server = require('./server');
const Manager = require('./manager');

const path = require('path');

// get the config
const file = path.resolve(process.argv[2]); // arg to absolute path
const config = require(file); // merge config file

// create new stream manager
const manager = new Manager(config.manager);

// create a new server
const server = new Server(manager, config.server);

server.start();

