/* globals React, AudioPlayer */

// eslint-disable-next-line no-unused-vars
function ExampleAudioPlayer() {
  return React.createElement(AudioPlayer.PlayerContextConsumer, {}, function(
    playerContext
  ) {
    return React.createElement(AudioPlayer, {
      playerContext: playerContext,
      showVideo: true,
      controls: [
        'spacer',
        'backskip',
        'playpause',
        'forwardskip',
        'volume',
        'shuffle',
        'repeat',
        'spacer',
        'progress',
        'fullscreen'
      ]
    });
  });
}
