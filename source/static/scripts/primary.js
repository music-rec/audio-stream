(window => {
  'use strict';

  // manages a single stream
  class Stream {
    constructor (element, click) {
      this.element = element;

      this.element.addEventListener('click', event => click(this));
    }

    set state (state) {
      this.element.classList.remove('stream_playing');
      this.element.classList.remove('stream_buffering');

      if (state)
        this.element.classList.add('stream_' + state);
    }

    get uid () {
      return this.element.getAttribute('data-uid');
    }
  }

  // manages the interface
  class UI {
    constructor () {
      this.current = null;
    }

    // initialise the streams
    init () {
      this.parent = window.document.querySelector('.streams');

      for (let stream of window.document.querySelectorAll('.stream'))
        new Stream(stream, stream => this.click(stream));
    }

    // triggered when a stream is clicked on
    click (stream) {
      if (this.current)
        this.current.state = null;
      
      // TODO: stop this.current playing

      if (stream == this.current) {
        this.current = null;
      } else {
        this.current = stream;
        this.current.state = 'buffering';

        // TODO: start this.current playing
        console.log(this.current);
        socket.emit('request stream', this.current.uid);
      }
    }
  }

  const socket = new io();
  const ui = new UI();

  // make app run when dom is ready
  window.document.addEventListener('DOMContentLoaded', event => {
    ui.init();
  });
})(window);

