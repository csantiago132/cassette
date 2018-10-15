`MediaPlayer` takes all the non-`children` props (including prop requirements) of [`MediaPlayer`](#mediaplayer), [`PlayerContextProvider`](#playercontextprovider) and [`FullscreenContextProvider`](#fullscreencontextprovider).

```jsx
const { MediaPlayer } = require('@cassette/player');
const playlist = [
  {
    url:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    title: 'Big Buck Bunny',
    artist: 'Peach Open Movie Project'
  }
];
<MediaPlayer
  playlist={playlist}
  controls={['spacer', 'playpause', 'mute', 'spacer', 'progress']}
  defaultRepeatStrategy="none"
  showVideo
/>;
```
