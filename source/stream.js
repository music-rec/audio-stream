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

// manages stream encoding and rebroadcasting
class StreamManager {
  constructor (config) {
    this.streams = {};
    for (let stream of config.streams || [])
      this.streams[hash(stream.source)] = stream; // hashed source is uid
  }

  stream (uid) {

  }
}

module.exports = {
  StreamManager: StreamManager
};
