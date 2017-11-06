'use strict';

const crypto = require('crypto');
const express = require('express');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

// get sha256 in hex string
const hash = string => {
  const f = crypto.createHash('sha256');

  f.update(string);

  return f.digest('hex')
}

class Output {
  constructor (source) {
    this.source = source;

    this.encoder = ffmpeg(source)
      .native()
      .format('ogg')
      .audioCodec('libopus')
      .audioBitrate('64k')
      .on('error', error => console.log(error))
      .on('end', () => console.log('finished'))
  }
}

// manages stream encoding and rebroadcasting
class StreamManager {
  constructor (config) {
    this.streams = {};

    for (let stream of config.streams || []) {
      this.streams[hash(stream.source)] = stream; // hashed source is uid
    }
  }

  stream (uid, response) {
    if (!this.streams[uid].output) this.streams[uid].output = new Output(this.streams[uid].source);

    this.streams[uid].output.encoder.stream(response);
  }
}

module.exports = {
  StreamManager: StreamManager
};
