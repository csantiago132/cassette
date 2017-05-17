const loopchange = new Event('loopchange');

function createAudioElementWithLoopEvent () {
  const audio = document.createElement('audio');
  new MutationObserver(() => {
    audio.dispatchEvent(loopchange);
  }).observe(audio, {
    attributeFilter: ['loop']
  });
  return audio;
}

module.exports = createAudioElementWithLoopEvent;
