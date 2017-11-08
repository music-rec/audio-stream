(window => {
  'use strict';

  // manages the stream audio
  class Player {
    constructor () {
      this.audio = null;
    }

    play (uid) {
      this.audio = new window.Audio(`/stream/${uid}`);
      this.audio.play();
    }

    stop () {
      this.audio.pause();
      this.audio.src = '';
      //this.audio.currentTime = 0;
    }
  }

  // manages the notification message
  class Message {
    constructor () {
      this.element = window.document.querySelector('.message');

      this.element.addEventListener('click', this.dismiss);
    }

    // dismiss the message
    dismiss (event) {
      event.target.classList.remove('message_visible');
      event.target.classList.remove('message_error');

      window.setTimeout(() => {
        event.target.classList.add('hidden');
      }, 300);
    }

    // set and display the message
    set (text, state) {
      this.element.textContent = text;

      this.element.classList.add('message_visible');
      this.element.classList.add('message_' + (state || 'error'));

      this.element.classList.remove('hidden');
    }
  }

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
      this.message = null;
      this.player = null;
    }

    // initialise the streams
    init () {
      this.message = new Message();
      this.player = new Player();

      for (let stream of window.document.querySelectorAll('.stream'))
        new Stream(stream, stream => this.click(stream));
    }

    // triggered when a stream is clicked on
    click (stream) {
      if (this.current) {
        this.current.state = null;
        this.player.stop();
      }

      if (stream == this.current) {
        this.current = null;
      } else {
        this.current = stream;
        this.current.state = 'buffering';

        this.player.play(this.current.uid);
      }
    }
  }

  const ui = new UI();

  // make app run when dom is ready
  window.document.addEventListener('DOMContentLoaded', event => {
    ui.init();
  });
})(window);

