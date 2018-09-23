/* globals React, AudioPlayer */

// eslint-disable-next-line no-unused-vars
function ExampleAudioPlayer() {
  return React.createElement(AudioPlayer.PlayerContextConsumer, {}, function(
    playerContext
  ) {
    return React.createElement(AudioPlayer, {
      playerContext: playerContext,
      showVideo: true,
      renderVideoDisplay: function renderVideoDisplay(
        playerContext,
        fullscreenContext
      ) {
        return React.createElement(AudioPlayer.VideoDisplay, {
          className: 'rrap__video_display_container',
          onClick: playerContext.onTogglePause,
          playerContext,
          fullscreenContext,
          displayWidth: 720
        });
      },
      videoDisplayWidth: 720,
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
