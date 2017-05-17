const loopchange = new Event('loopchange');

class HTMLAudioElementWithLoopEvent extends HTMLAudioElement {
  get loop () {
    return super.loop;
  }

  set loop (value) {
    super.loop = value;
    this.dispatchEvent(loopchange);
  }
}

document.registerElement('audio-with-loop-event', {
  prototype: HTMLAudioElementWithLoopEvent.prototype,
  extends: 'audio'
});

function createHTMLAudioElementWithLoopEvent () {
  return document.createElement('audio', 'audio-with-loop-event');
}

module.exports = createHTMLAudioElementWithLoopEvent;
