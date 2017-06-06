// we shouldn't initialize browser events at the module
// level since our code could be run inside of Node
// for server rendering (which won't require use of
// this module but may still import it).
let loopchange;
let srcchange;

function createCustomAudioElement (audio = document.createElement('audio')) {
  new MutationObserver(() => {
    loopchange = loopchange || new Event('loopchange');
    audio.dispatchEvent(loopchange);
  }).observe(audio, {
    attributeFilter: ['loop']
  });
  new MutationObserver(() => {
    srcchange = srcchange || new Event('srcchange');
    audio.dispatchEvent(srcchange);
  }).observe(audio, {
    attributeFilter: ['src']
  });
  return audio;
}

export default createCustomAudioElement;
