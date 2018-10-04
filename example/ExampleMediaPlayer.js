/* globals React, cassettePlayer */

// eslint-disable-next-line no-unused-vars
function ExampleMediaPlayer() {
  return React.createElement(cassettePlayer.MediaPlayerControls, {
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
}
