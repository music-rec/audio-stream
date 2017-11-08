'use strict';

const crypto = require('crypto');
const express = require('express');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const mime = require('mime-types');
const stream = require('stream');

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
    .audioBitrate(encoding.bitrate);
}

// manages a stream output
class Output extends stream.Duplex {
  _write (chunk, encoding, callback) {
    this.push(chunk);
    callback();
  }

  _read (size) {}
}

// manages a single stream
class Stream {
  constructor (stream, encoding) {
    this.ready = false;

    this.name = stream.name;
    this.source = stream.source;

    this.mime = mime.lookup(encoding.format);

    this.encoder = preset(this.source, encoding); 
    this.encoder.on('start', this.start.bind(this));
    this.encoder.on('error', this.error.bind(this));
    this.encoder.on('end', this.end.bind(this));

    this.output = new Output();

    this.connections = 0; // ammount of concurrent connections

    this.encoder.pipe(this.output); // start ffmpeg process
  }

  start (command) {
    this.ready = true;
    this.update();
  }

  error (error) {
    this.ready = false;
  }

  end (stdout, stderr) {
    this.ready = false;
  }

  // connect
  connect () {
    this.connections += 1;
    this.update();
  }

  // close stream
  disconnect () {
    this.connections -= 1;
    this.update();
  }

  // pipe stream to client request response
  pipe (response) {
    response.contentType(this.mime);

    this.output.pipe(response);
  }

  update () {
    if (this.connections > 0) 
      this.encoder.kill('SIGCONT');
    else
      this.encoder.kill('SIGSTOP');
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
