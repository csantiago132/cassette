function ExampleAudioPlayer() {
  return React.createElement(AudioPlayer.PlayerContextConsumer, {}, function(
    playerContext
  ) {
    return React.createElement(AudioPlayer, {
      playerContext: playerContext,
      showVideo: true,
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
