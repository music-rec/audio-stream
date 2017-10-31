(window => {
  'use strict';

  // manages a single stream
  class Stream {
    constructor (play, stop) {
      this.play = play;
      this.stop = stop;

      // this.element.addEventListener('click', this.toggle.bind(this));
    }

    toggle (event) {
      if (this.playing) {
        this.play(this);
      } else if (!this.playing) {
        this.stop(this);
      }
    }
  }

  // manages the interface
  class UI {
    constructor () {
      this.streams = []
    }

    init () {
      this.parent = window.document.querySelector('.streams');
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

