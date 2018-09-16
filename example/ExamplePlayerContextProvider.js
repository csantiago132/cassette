class ExamplePlayerContextProvider extends React.Component {
  constructor(props) {
    super(props);
    this.handleStateSnapshot = this.handleStateSnapshot.bind(this);
    this.initialStateSnapshot = JSON.parse(
      localStorage.getItem('audio_player_snapshot')
    );
  }

  handleStateSnapshot(snapshot) {
    localStorage.setItem('audio_player_snapshot', JSON.stringify(snapshot));
  }

  render() {
    return React.createElement(
      AudioPlayer.PlayerContextProvider,
      {
        playlist: this.props.playlist,
        autoplay: true,
        defaultMuted: true,
        defaultShuffle: false,
        crossOrigin: 'anonymous',
        initialStateSnapshot: this.initialStateSnapshot,
        onStateSnapshot: this.handleStateSnapshot
      },
      this.props.children
    );
  }
}
