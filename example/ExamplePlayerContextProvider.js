function ExamplePlayerContextProvider(props) {
  return React.createElement(
    AudioPlayer.PlayerContextProvider,
    {
      playlist: props.playlist,
      autoplay: true,
      defaultMuted: true,
      defaultShuffle: false,
      crossOrigin: 'anonymous'
    },
    props.children
  );
}
