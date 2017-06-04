let loopchange;

function createAudioElementWithLoopEvent (audio = document.createElement('audio')) {
  new MutationObserver(() => {
    // we shouldn't initialize loopchange at the module
    // level since our code could be run inside of Node
    // for server rendering (which won't require use of
    // this module but may still import it).
    loopchange = loopchange || new Event('loopchange');
    audio.dispatchEvent(loopchange);
  }).observe(audio, {
    attributeFilter: ['loop']
  });
  return audio;
}

export default createAudioElementWithLoopEvent;
