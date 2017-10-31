(window => {
  'use strict';

  // manages a single stream
  class Stream {
    constructor (play, stop) {
      this.play = play;
      this.stop = stop;

      this.element = window.document.createElement('div');
      this.element.classList.add('stream');
      this.element.addEventListener('click', this.toggle.bind(this));

      this.playing = false;
    }

    toggle (event) {
      if (this.playing) {
        this.play(this);
      } else if (!this.playing) {
        this.stop(this);
      }
    }

    get name () {
      return this.element.getAttribute('data-name');
    }

    set name (name) {
      this.element.setAttribute('data-name', name);
    }
  }

  // manages the interface
  class UI {
    constructor () {
      this.streams = []
    }

    init () {
      this.parent = window.document.querySelector('.streams');

      // download stream info
      window.fetch('/streams/info.json')
        .then(response => response.json())
        .then(this.config)
        .catch(console.error);
    }

    config (config) {
      for (let channel of config.channels) {
        const stream = new Stream();
        stream.name = channel.name;

        this.addStream(stream);
      }
    }

    // add a stream to the ui
    addStream (stream) {
      this.parent.appendChild(stream.element);
    }

    play (stream) {

    }

    stop (stream) {

    }
  }

  const ui = new UI();

  // make app run when dom is ready
  window.document.addEventListener('DOMContentLoaded', event => {
    ui.init();
  });
})(window);

