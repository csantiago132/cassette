const loopchange = new Event('loopchange');

function createHTMLAudioElementWithLoopEvent () {
  const audio = document.createElement('audio');
  new MutationObserver(() => {
    audio.dispatchEvent(loopchange);
  }).observe(audio, {
    attributeFilter: ['loop']
  });
  return audio;
}

module.exports = createHTMLAudioElementWithLoopEvent;
