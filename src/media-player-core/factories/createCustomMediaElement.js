const loopchange = 'loopchange';
const srcrequest = 'srcrequest';

function createCustomMediaElement(audio = document.createElement('audio')) {
  new MutationObserver(() => {
    audio.dispatchEvent(new Event(loopchange));
  }).observe(audio, {
    attributeFilter: ['loop']
  });
  // Don't let the audio src property get modified directly.
  // Instead, when it does get set, dispatch an event to be
  // handled in a way that doesn't conflict with the loaded
  // playlist.
  Object.defineProperty(audio, 'src', {
    get: () => audio.currentSrc,
    set: src => {
      const e = new Event(srcrequest);
      e.srcRequested = src;
      audio.dispatchEvent(e);
    }
  });
  return audio;
}

export default createCustomMediaElement;
