/* globals React, MediaPlayer */

// eslint-disable-next-line no-unused-vars
function ExampleMediaPlayer() {
  return React.createElement(MediaPlayer, {
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
