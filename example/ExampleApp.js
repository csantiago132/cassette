function ExampleApp(props) {
  return React.createElement(
    React.StrictMode,
    {},
    React.createElement(
      ExamplePlayerContextProvider,
      {
        playlist: props.playlist
      },
      React.createElement(ExampleAudioPlayer),
      React.createElement(ExampleMediaInfo)
    )
  );
}
