'use strict';

const crypto = require('crypto');
const express = require('express');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const mime = require('mime-types');

// get sha256 in hex string
const hash = string => {
  const f = crypto.createHash('sha256');
  f.update(string);
  return f.digest('hex')
}

// encoder preset
const preset = (source, encoding) => {
  return ffmpeg(source)
    .native()
    .format(encoding.format)
    .audioBitrate(encoding.bitrate)
    .on('error', error => console.log(error))
    .on('end', () => console.log('finished'));
}

// manages a single stream
class Stream {
  constructor (stream, encoding) {
    this.name = stream.name;
    this.encoding = encoding;
    this.encoder = preset(stream.source, this.encoding);
  }

  // pipe stream to client request response
  pipe (response) {
    response.contentType(mime.lookup(this.encoding.format));

    this.encoder.pipe(response);
  }
}

// manages streams
class Manager {
  constructor (config) {
    this.streams = {};

    for (let stream of config.streams || []) {
      this.streams[hash(stream.source)] = new Stream(stream, config.encoding);
    }
  }
}

module.exports = Manager;
