import React from 'react';
import arrayFindIndex from 'array-find-index';
import classNames from 'classnames';

import BackSkipButton from './controls/BackSkipButton';
import ForwardSkipButton from './controls/ForwardSkipButton';
import PlayPauseButton from './controls/PlayPauseButton';
import AudioProgress from './controls/AudioProgress';
import Spacer from './controls/Spacer';
import getDisplayText from './utils/getDisplayText';

import './index.scss';

const log = console.log;
const logError = console.error || log;
const logWarning = console.warn || log;

/*
 * AudioPlayer
 *
 * Accepts 'playlist' prop of the form:
 *
 * [{ "url": "./path/to/file.mp3",
 *    "displayText": "ArtistA - Track 1" },
 *  { "url": "https://domain.com/track2.ogg",
 *    "displayText": "ArtistB - Track 2" }]
 *
 * Accepts 'autoplay' prop (true/[false]).
 *
 * Accepts 'autoplayDelayInSeconds' prop (default 0).
 *
 * Accepts 'gapLengthInSeconds' prop (default 0).
 * Specifies gap at end of one track before next
 * track begins (ignored for manual skip).
 *
 * Accepts 'disableSeek' prop (default false,
 * disables seeking through the audio if true).
 *
 * Accepts 'cycle' prop (default true,
 * starts playing at the beginning of the playlist
 * when finished if true).
 *
 * Accepts 'stayOnBackSkipThreshold' prop, default 5,
 * is number of seconds to progress until pressing back skip
 * restarts the current track.
 *
 * Accepts 'style' prop, object, is applied to
 * outermost div (React styles).
 *
 * Accepts 'onMediaEvent' prop, an object used for
 * listening to media events on the underlying audio element.
 *
 * Accepts 'audioElementRef' prop, a function called after
 * the component mounts and before it unmounts with the
 * internally-referenced HTML audio element as its only parameter.
 * Similar to: https://facebook.github.io/react/docs/refs-and-the-dom.html
 */
class AudioPlayer extends React.Component {

  constructor (props) {
    super(props);

    // index matching requested track (whether track has loaded or not)
    this.currentTrackIndex = 0;

    this.defaultState = {
      /* activeTrackIndex will change to match
       * this.currentTrackIndex once metadata has loaded
       */
      activeTrackIndex: -1,
      // indicates whether audio player should be paused
      paused: true,
      /* elapsed time for current track, in seconds -
       * DISPLAY ONLY! the actual elapsed time may
       * not match up if we're currently seeking, since
       * the new time is visually previewed before the
       * audio seeks.
       */
      displayedTime: 0,
      /* true if the user is currently dragging the mouse
       * to seek a new track position
       */
      seekInProgress: false
    };

    this.state = {
      ...this.defaultState,
      // html audio element used for playback
      audio: null
    };

    // bind methods fired on React events
    this.togglePause = this.togglePause.bind(this);
    this.skipToNextTrack = this.skipToNextTrack.bind(this);
    this.backSkip = this.backSkip.bind(this);
    this.handleSeekPreview = this.handleSeekPreview.bind(this);
    this.handleSeekComplete = this.handleSeekComplete.bind(this);

    // audio event listeners to add on mount and remove on unmount
    this.audioPlayListener = () => this.setState({ paused: false });
    this.audioPauseListener = () => this.setState({ paused: true });
    this.audioEndListener = () => {
      const gapLengthInSeconds = this.props.gapLengthInSeconds || 0;
      clearTimeout(this.gapLengthTimeout);
      this.gapLengthTimeout = setTimeout(() => this.skipToNextTrack(), gapLengthInSeconds * 1000);
    };
    this.audioStallListener = () => this.togglePause(true);
    this.audioTimeUpdateListener = () => this.handleTimeUpdate();
    this.audioMetadataLoadedListener = () => this.setState({
      activeTrackIndex: this.currentTrackIndex
    });
  }

  componentDidMount () {
    const audio = document.createElement('audio');
    this.setState({ audio }, () => {

      // add event listeners on the audio element
      audio.preload = 'metadata';
      audio.addEventListener('play', this.audioPlayListener);
      audio.addEventListener('pause', this.audioPauseListener);
      audio.addEventListener('ended', this.audioEndListener);
      audio.addEventListener('stalled', this.audioStallListener);
      audio.addEventListener('timeupdate', this.audioTimeUpdateListener);
      audio.addEventListener('loadedmetadata', this.audioMetadataLoadedListener);
      this.addMediaEventListeners(this.props.onMediaEvent);

      if (this.props.playlist && this.props.playlist.length) {
        this.updateSource();
        if (this.props.autoplay) {
          const delay = this.props.autoplayDelayInSeconds || 0;
          clearTimeout(this.delayTimeout);
          this.delayTimeout = setTimeout(() => this.togglePause(false), delay * 1000);
        }
      }

    });

    if (this.props.audioElementRef) {
      this.props.audioElementRef(audio);
    }
  }

  componentWillReceiveProps (nextProps) {
    // Update media event listeners that may have changed
    this.removeMediaEventListeners(this.props.onMediaEvent);
    this.addMediaEventListeners(nextProps.onMediaEvent);

    const newPlaylist = nextProps.playlist;
    if (!newPlaylist || !newPlaylist.length) {
      this.state.audio.src = '';
      this.currentTrackIndex = 0;
      return this.setState(this.defaultState);
    }

    const oldPlaylist = this.props.playlist;

    const currentTrackUrl = ((oldPlaylist || [])[this.currentTrackIndex] || {}).url;
    this.currentTrackIndex = arrayFindIndex(newPlaylist, track => {
      return track.url && currentTrackUrl === track.url;
    });
    /* if the track we're already playing is in the new playlist, update the
     * activeTrackIndex.
     */
    if (this.currentTrackIndex !== -1) {
      this.setState({
        activeTrackIndex: this.currentTrackIndex
      });
    }
  }

  componentDidUpdate () {
    /* if we loaded a new playlist and reset the current track marker, we
     * should load up the first one.
     */
    if (this.currentTrackIndex === -1) {
      this.skipToNextTrack(false);
    }
  }

  componentWillUnmount () {
    const { audio } = this.state;
    // remove event listeners on the audio element
    audio.removeEventListener('play', this.audioPlayListener);
    audio.removeEventListener('pause', this.audioPauseListener);
    audio.removeEventListener('ended', this.audioEndListener);
    audio.removeEventListener('stalled', this.audioStallListener);
    audio.removeEventListener('timeupdate', this.audioTimeUpdateListener);
    audio.removeEventListener('loadedmetadata', this.audioMetadataLoadedListener);
    removeMediaEventListeners(this.props.onMediaEvent);

    clearTimeout(this.gapLengthTimeout);
    clearTimeout(this.delayTimeout);

    // pause the audio element before we unmount
    audio.pause();

    if (this.props.audioElementRef) {
      this.props.audioElementRef(audio);
    }
  }

  addMediaEventListeners (mediaEvents) {
    if (!mediaEvents) {
      return;
    }
    Object.keys(mediaEvents).forEach((type) => {
      if (typeof mediaEvents[type] !== 'function') {
        return;
      }
      this.state.audio.addEventListener(type, mediaEvents[type]);
    });
  }

  removeMediaEventListeners (mediaEvents) {
    if (!mediaEvents) {
      return;
    }
    Object.keys(mediaEvents).forEach((type) => {
      if (typeof mediaEvents[type] !== 'function') {
        return;
      }
      this.state.audio.removeEventListener(type, mediaEvents[type]);
    });
  }

  togglePause (value) {
    const { playlist } = this.props;
    const { audio, paused } = this.state;
    if (!audio) {
      return;
    }
    const pause = typeof value === 'boolean' ? value : !paused;
    if (pause) {
      return audio.pause();
    }
    if (!playlist || !playlist.length) {
      return;
    }
    try {
      audio.play();
    } catch (error) {
      logError(error);
      const warningMessage =
        'Audio playback failed at ' +
        new Date().toLocaleTimeString() +
        '! (Perhaps autoplay is disabled in this browser.)';
      logWarning(warningMessage);
    }
  }

  skipToNextTrack (shouldPlay) {
    const { playlist, cycle } = this.props;
    const { audio } = this.state;
    if (!audio) {
      return;
    }
    audio.pause();
    if (!playlist || !playlist.length) {
      return;
    }
    let i = this.currentTrackIndex + 1;
    if (i >= playlist.length) {
      i = 0;
    }
    this.currentTrackIndex = i;
    this.setState({
      activeTrackIndex: -1,
      displayedTime: 0
    }, () => {
      this.updateSource();
      const shouldPauseOnCycle = (!cycle && i === 0);
      const shouldPause = shouldPauseOnCycle || (typeof shouldPlay === 'boolean' ? !shouldPlay : false);
      this.togglePause(shouldPause);
    });
  }

  backSkip () {
    const { playlist, stayOnBackSkipThreshold } = this.props;
    const { audio } = this.state;
    if (!playlist || !playlist.length) {
      return;
    }
    let stayThreshold = stayOnBackSkipThreshold;
    if (isNaN(stayThreshold)) {
      stayThreshold = 5;
    }
    if (audio.currentTime >= stayThreshold) {
      return audio.currentTime = 0;
    }
    let i = this.currentTrackIndex - 1;
    if (i < 0) {
      i = playlist.length - 1;
    }
    this.currentTrackIndex = i - 1;
    this.skipToNextTrack();
  }

  updateSource () {
    this.state.audio.src = this.props.playlist[this.currentTrackIndex].url;
  }

  handleTimeUpdate () {
    const { seekInProgress, audio } = this.state;
    if (!seekInProgress && audio) {
      this.setState({
        displayedTime: audio.currentTime
      });
    }
  }

  handleSeekPreview (progress) {
    if (this.isSeekUnavailable()) {
      return;
    }
    const progressInBounds = Math.max(0, Math.min(progress, 1));
    this.setState({
      displayedTime: progressInBounds * this.state.audio.duration,
      seekInProgress: true
    });
  }

  handleSeekComplete () {
    this.setState({
      seekInProgress: false
    });
    const displayedTime = this.state.displayedTime;
    if (isNaN(displayedTime)) {
      return;
    }
    this.state.audio.currentTime = displayedTime;
  }

  isSeekUnavailable () {
    return Boolean(
      !this.props.playlist ||
      !this.props.playlist.length ||
      this.props.disableSeek
    );
  }

  render () {
    const { playlist, style } = this.props;
    const {
      activeTrackIndex,
      paused,
      displayedTime,
      seekInProgress,
      audio
    } = this.state;
    return (
      <div
        className="audio_player"
        title={getDisplayText(playlist, activeTrackIndex)}
        style={style}
      >

        <Spacer />
        <BackSkipButton onBackSkip={this.backSkip} />
        <PlayPauseButton paused={paused} onTogglePause={this.togglePause} />
        <ForwardSkipButton onForwardSkip={this.skipToNextTrack} />
        <Spacer />
        <AudioProgress
          playlist={playlist}
          activeTrackIndex={activeTrackIndex}
          displayedTime={displayedTime}
          seekInProgress={seekInProgress}
          seekUnavailable={this.isSeekUnavailable()}
          audio={audio}
          onSeekPreview={this.handleSeekPreview}
          onSeekComplete={this.handleSeekComplete}
        />

      </div>
    );
  }

}

AudioPlayer.propTypes = {
  playlist: React.PropTypes.array,
  autoplay: React.PropTypes.bool,
  autoplayDelayInSeconds: React.PropTypes.number,
  gapLengthInSeconds: React.PropTypes.number,
  cycle: React.PropTypes.bool,
  disableSeek: React.PropTypes.bool,
  stayOnBackSkipThreshold: React.PropTypes.number,
  style: React.PropTypes.object,
  onMediaEvent: React.PropTypes.object,
  audioElementRef: React.PropTypes.func
};

AudioPlayer.defaultProps = {
  cycle: true
};

module.exports = AudioPlayer;
