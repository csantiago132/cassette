import React, { Component } from 'react';
import PropTypes from 'prop-types';
import arrayFindIndex from 'array-find-index';
import classNames from 'classnames';

import createAudioElementWithLoopEvent from './factories/createAudioElementWithLoopEvent';
import isPlaylistValid from './utils/isPlaylistValid';
import getDisplayText from './utils/getDisplayText';
import getRepeatStrategy from './utils/getRepeatStrategy';
import getControlComponent from './utils/getControlComponent';
import convertToNumberWithinIntervalBounds from './utils/convertToNumberWithinIntervalBounds';
import { repeatStrategyOptions } from './constants';

import './styles/index.scss';

const log = console.log.bind(console);
const logError = console.error ? console.error.bind(console) : log;
const logWarning = console.warn ? console.warn.bind(console) : log;

let nextControlKey = 0;
function getNextControlKey () {
  return (nextControlKey++).toString();
}

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
 * Accepts 'cycle' prop (default true,
 * starts playing at the beginning of the playlist
 * when finished if true).
 *
 * Accepts 'loadFirstTrackOnPlaylistComplete' prop
 * (default true, loads up first track when playlist
 * has completed. Ignored if 'cycle' is true.)
 *
 * Accepts 'pauseOnSeekPreview' prop (default true,
 * pauses audio while user is selecting new time
 * for playback)
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
class AudioPlayer extends Component {

  constructor (props) {
    super(props);

    this.defaultState = {
      /* activeTrackIndex will change to match
       * this.currentTrackIndex once metadata has loaded
       */
      activeTrackIndex: -1,
      // indicates whether audio player should be paused
      paused: true,
      // elapsed time for current track, in seconds
      currentTime: 0,
      // The most recent targeted time, in seconds, for seek preview
      seekPreviewTime: 0,
      /* true if the user is currently dragging the mouse
       * to seek a new track position
       */
      seekInProgress: false,
      /* true if audio was playing when seek previewing began,
       * it was paused, and it should be resumed on seek
       * complete
       */
      awaitingResumeOnSeekComplete: false,
      // the duration in seconds of the loaded track
      duration: 0,
      /* the TimeRanges object representing the buffered sections of the
       * loaded track
       */
      buffered: null,
      /* the TimeRanges object representing the played sections of the
       * loaded track
       */
      played: null
    };

    this.state = {
      ...this.defaultState,
      currentTime: convertToNumberWithinIntervalBounds(props.startingTime, 0),
      // the latest volume of the audio, between 0 and 1.
      volume: convertToNumberWithinIntervalBounds(props.defaultVolume, 0, 1),
      // true if the audio has been muted
      muted: props.defaultMuted,
      // whether to loop the current track
      loop: props.defaultRepeatStrategy === 'track',
      // true if playlist should continue at start after completion
      cycle: props.defaultRepeatStrategy === 'playlist',
      // Rate at which audio should be played. 1.0 is normal speed.
      playbackRate: props.defaultPlaybackRate,
      // true if user is currently dragging mouse to change the volume
      setVolumeInProgress: false
    };

    // index matching requested track (whether track has loaded or not)
    this.currentTrackIndex = props.startingTrackIndex;

    // volume at last time we were unmuted and not actively setting volume
    this.lastStableVolume = this.state.volume;

    // set of keys to use in controls render
    this.controlKeys = props.controls.map(getNextControlKey);

    // html audio element used for playback
    this.audio = null;

    // bind methods fired on React events
    this.togglePause = this.togglePause.bind(this);
    this.selectTrackIndex = this.selectTrackIndex.bind(this);
    this.forwardSkip = this.forwardSkip.bind(this);
    this.backSkip = this.backSkip.bind(this);
    this.seekPreview = this.seekPreview.bind(this);
    this.seekComplete = this.seekComplete.bind(this);
    this.setVolume = this.setVolume.bind(this);
    this.setVolumeComplete = this.setVolumeComplete.bind(this);
    this.toggleMuted = this.toggleMuted.bind(this);
    this.setRepeatStrategy = this.setRepeatStrategy.bind(this);
    this.setPlaybackRate = this.setPlaybackRate.bind(this);

    // bind audio event listeners to add on mount and remove on unmount
    this.handleAudioPlay = this.handleAudioPlay.bind(this);
    this.handleAudioPause = this.handleAudioPause.bind(this);
    this.handleAudioEnded = this.handleAudioEnded.bind(this);
    this.handleAudioStalled = this.handleAudioStalled.bind(this);
    this.handleAudioTimeupdate = this.handleAudioTimeupdate.bind(this);
    this.handleAudioLoadedmetadata = this.handleAudioLoadedmetadata.bind(this);
    this.handleAudioVolumechange = this.handleAudioVolumechange.bind(this);
    this.handleAudioDurationchange = this.handleAudioDurationchange.bind(this);
    this.handleAudioProgress = this.handleAudioProgress.bind(this);
    this.handleAudioLoopchange = this.handleAudioLoopchange.bind(this);
    this.handleAudioRatechange = this.handleAudioRatechange.bind(this);
  }

  componentDidMount () {
    const audio = this.audio = createAudioElementWithLoopEvent();

    // initialize audio properties
    audio.crossOrigin = this.props.crossOrigin;
    audio.currentTime = this.state.currentTime;
    audio.volume = this.state.volume;
    audio.muted = this.state.muted;
    audio.loop = this.state.loop;
    audio.playbackRate = this.state.playbackRate;

    // add event listeners on the audio element
    audio.preload = 'metadata';
    audio.addEventListener('play', this.handleAudioPlay);
    audio.addEventListener('pause', this.handleAudioPause);
    audio.addEventListener('ended', this.handleAudioEnded);
    audio.addEventListener('stalled', this.handleAudioStalled);
    audio.addEventListener('timeupdate', this.handleAudioTimeupdate);
    audio.addEventListener('loadedmetadata', this.handleAudioLoadedmetadata);
    audio.addEventListener('volumechange', this.handleAudioVolumechange);
    audio.addEventListener('durationchange', this.handleAudioDurationchange);
    audio.addEventListener('progress', this.handleAudioProgress);
    audio.addEventListener('loopchange', this.handleAudioLoopchange);
    audio.addEventListener('ratechange', this.handleAudioRatechange);
    this.addMediaEventListeners(this.props.onMediaEvent);

    if (isPlaylistValid(this.props.playlist)) {
      this.updateSource();
      if (this.props.autoplay) {
        clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
          this.togglePause(false);
        }, this.props.autoplayDelayInSeconds * 1000);
      }
    }

    if (this.props.audioElementRef) {
      this.props.audioElementRef(audio);
    }
  }

  componentWillReceiveProps (nextProps) {
    // Update media event listeners that may have changed
    this.removeMediaEventListeners(this.props.onMediaEvent);
    this.addMediaEventListeners(nextProps.onMediaEvent);

    if (this.props.crossOrigin !== nextProps.crossOrigin) {
      this.audio.crossOrigin = nextProps.crossOrigin;
    }

    const oldControls = [...this.props.controls];
    this.controlKeys = nextProps.controls.map(control => {
      const matchingIndex = oldControls.indexOf(control);
      if (matchingIndex !== -1 && oldControls[matchingIndex]) {
        oldControls[matchingIndex] = null;
        return this.controlKeys[matchingIndex];
      }
      return getNextControlKey();
    });

    const newPlaylist = nextProps.playlist;
    if (!isPlaylistValid(newPlaylist)) {
      this.audio.src = '';
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
    /* if we loaded a new playlist and the currently playing track couldn't
     * be found, pause and load the first track in the new playlist.
     */
    if (this.currentTrackIndex === -1) {
      this.selectTrackIndex(0, false);
    }
  }

  componentWillUnmount () {
    const { audio } = this;
    // remove event listeners on the audio element
    audio.removeEventListener('play', this.handleAudioPlay);
    audio.removeEventListener('pause', this.handleAudioPause);
    audio.removeEventListener('ended', this.handleAudioEnded);
    audio.removeEventListener('stalled', this.handleAudioStalled);
    audio.removeEventListener('timeupdate', this.handleAudioTimeupdate);
    audio.removeEventListener('loadedmetadata', this.handleAudioLoadedmetadata);
    audio.removeEventListener('volumechange', this.handleAudioVolumechange);
    audio.removeEventListener('durationchange', this.handleAudioDurationchange);
    audio.removeEventListener('progress', this.handleAudioProgress);
    audio.removeEventListener('loopchange', this.handleAudioLoopchange);
    audio.removeEventListener('ratechange', this.handleAudioRatechange);
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
      this.audio.addEventListener(type, mediaEvents[type]);
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
      this.audio.removeEventListener(type, mediaEvents[type]);
    });
  }

  handleAudioPlay () {
    this.setState({ paused: false });
  }

  handleAudioPause () {
    this.setState({ paused: true });
  }

  handleAudioEnded () {
    clearTimeout(this.gapLengthTimeout);
    const { playlist } = this.props;
    if (!isPlaylistValid(playlist)) {
      return;
    }
    if (!this.state.cycle && this.currentTrackIndex + 1 >= playlist.length) {
      if (this.props.loadFirstTrackOnPlaylistComplete) {
        this.selectTrackIndex(0, false);
      }
      return;
    }
    this.gapLengthTimeout = setTimeout(
      this.forwardSkip,
      this.props.gapLengthInSeconds * 1000
    );
  }

  handleAudioStalled () {
    this.togglePause(true);
  }

  handleAudioTimeupdate () {
    const { currentTime, played } = this.audio;
    this.setState({ currentTime, played });
  }

  handleAudioLoadedmetadata () {
    this.setState({
      activeTrackIndex: this.currentTrackIndex
    });
  }

  handleAudioVolumechange () {
    const { volume, muted } = this.audio;
    this.setState({ volume, muted });
  }

  handleAudioDurationchange () {
    const { duration } = this.audio;
    this.setState({ duration });
  }

  handleAudioProgress () {
    const { buffered } = this.audio;
    this.setState({ buffered });
  }

  handleAudioLoopchange () {
    const { loop } = this.audio;
    this.setState({ loop });
  }

  handleAudioRatechange () {
    const { playbackRate } = this.audio;
    this.setState({ playbackRate });
  }

  updateSource () {
    const { playlist, onActiveTrackUpdate } = this.props;
    if (!isPlaylistValid(playlist)) {
      this.audio.src = '';
      return;
    }
    const previousPlaybackRate = this.audio.playbackRate;
    this.audio.src = playlist[this.currentTrackIndex].url;
    // We want to keep the playbackRate where it is when we switch tracks
    this.audio.playbackRate = previousPlaybackRate;
    if (typeof onActiveTrackUpdate === 'function') {
      onActiveTrackUpdate(this.currentTrackIndex, playlist);
    }
  }

  togglePause (value) {
    const pause = typeof value === 'boolean' ? value : !this.state.paused;
    if (pause) {
      this.audio.pause();
      return;
    }
    if (!this.audio.src) {
      return;
    }
    try {
      this.audio.play();
    } catch (error) {
      logError(error);
      const warningMessage =
        'Audio playback failed at ' +
        new Date().toLocaleTimeString() +
        '! (Perhaps autoplay is disabled in this browser.)';
      logWarning(warningMessage);
    }
  }

  selectTrackIndex (index, shouldPlay = true) {
    const { playlist } = this.props;
    if (!isPlaylistValid(playlist)) {
      return;
    }
    if (index < 0 || index > playlist.length) {
      logWarning(`Playlist index ${index} is out of bounds!`);
      return;
    }
    const shouldSetLoopFalse = this.currentTrackIndex !== index;
    this.currentTrackIndex = index;
    this.setState({
      activeTrackIndex: -1,
      currentTime: 0
    }, () => {
      this.updateSource();
      if (shouldSetLoopFalse) {
        this.audio.loop = false;
      }
      this.togglePause(!shouldPlay);
    });
  }

  backSkip () {
    const { playlist, stayOnBackSkipThreshold } = this.props;
    const { audio } = this;
    if (!isPlaylistValid(playlist)) {
      return;
    }
    if (
      audio.currentTime >= stayOnBackSkipThreshold ||
      (!this.state.cycle && this.currentTrackIndex < 1)
    ) {
      audio.currentTime = 0;
      return;
    }
    let index = this.currentTrackIndex - 1;
    if (index < 0) {
      index = playlist.length - 1;
    }
    this.selectTrackIndex(index);
  }

  forwardSkip () {
    const { playlist } = this.props;
    if (
      !isPlaylistValid(playlist) ||
      (!this.state.cycle && (
        this.currentTrackIndex < 0 ||
        this.currentTrackIndex > playlist.length - 2
      ))
    ) {
      return;
    }
    let index = this.currentTrackIndex + 1;
    if (index >= playlist.length) {
      index = 0;
    }
    this.selectTrackIndex(index);
  }

  seekPreview (targetTime) {
    if (this.isSeekUnavailable()) {
      return;
    }
    const { paused, awaitingResumeOnSeekComplete } = this.state;
    if (!paused && this.props.pauseOnSeekPreview && !awaitingResumeOnSeekComplete) {
      this.setState({
        awaitingResumeOnSeekComplete: true
      });
      this.togglePause(true);
    }
    this.setState({
      seekPreviewTime: targetTime,
      seekInProgress: true
    });
  }

  seekComplete () {
    const { seekPreviewTime, awaitingResumeOnSeekComplete } = this.state;
    this.setState({
      seekInProgress: false,
    });
    if (isNaN(seekPreviewTime)) {
      return;
    }
    this.setState({
      /* we'll update currentTime on the audio listener hook anyway,
       * but the optimistic update helps avoid a visual glitch in
       * the progress bar, if seekInProgress changes before currentTime.
       */
      currentTime: seekPreviewTime
    });
    const { audio } = this;
    audio.currentTime = seekPreviewTime;
    if (awaitingResumeOnSeekComplete) {
      this.togglePause(false);
      this.setState({
        awaitingResumeOnSeekComplete: false
      });
    }
  }

  setVolume (volume) {
    if (!this.state.setVolumeInProgress) {
      this.setState({
        setVolumeInProgress: true
      });
    }
    const volumeInBounds = convertToNumberWithinIntervalBounds(volume, 0, 1);
    this.audio.muted = volumeInBounds === 0 ? true : false;
    this.audio.volume = volumeInBounds;
  }

  setVolumeComplete () {
    this.setState({
      setVolumeInProgress: false
    });
    if (!this.audio.muted) {
      this.lastStableVolume = this.audio.volume;
    }
  }

  toggleMuted (value) {
    const muted = typeof value === 'boolean' ? value : !this.state.muted;
    this.audio.muted = muted;
    if (!muted) {
      this.audio.volume = this.lastStableVolume;
    }
  }

  setRepeatStrategy (repeatStrategy) {
    if (repeatStrategyOptions.indexOf(repeatStrategy) === -1) {
      logWarning(
        'repeatStrategy "' + repeatStrategy + '" is not one of: ' +
        repeatStrategyOptions.split(', ') + '.'
      );
      return;
    }
    switch (repeatStrategy) {
      case 'track':
        // let event listener take care of state change.
        this.audio.loop = true;
        break;
      case 'playlist':
        this.setState({
          loop: false,
          cycle: true
        });
        this.audio.loop = false;
        break;
      case 'none':
        this.setState({
          loop: false,
          cycle: false
        });
        this.audio.loop = false;
        break;
      default:
        break;
    }
  }

  setPlaybackRate (rate) {
    this.audio.playbackRate = rate;
  }

  isSeekUnavailable () {
    return Boolean(!this.audio || !this.audio.src);
  }

  getControlProps (controlIndex) {
    const unknownProps = Object.keys(this.props).reduce((memo, propName) => {
      if (!(propName in AudioPlayer.propTypes)) {
        memo[propName] = this.props[propName];
      }
      return memo;
    }, {});

    const stateProps = { ...this.state };
    const { loop, cycle } = stateProps;
    // since we'll be passing repeatStrategy let's leave these out.
    delete stateProps.loop;
    delete stateProps.cycle;

    return {
      ...unknownProps,
      ...stateProps,
      key: this.controlKeys[controlIndex],
      playlist: this.props.playlist,
      seekUnavailable: this.isSeekUnavailable(),
      repeatStrategy: getRepeatStrategy(loop, cycle),
      onTogglePause: this.togglePause,
      onSelectTrackIndex: this.selectTrackIndex,
      onBackSkip: this.backSkip,
      onForwardSkip: this.forwardSkip,
      onSeekPreview: this.seekPreview,
      onSeekComplete: this.seekComplete,
      onSetVolume: this.setVolume,
      onSetVolumeComplete: this.setVolumeComplete,
      onToggleMuted: this.toggleMuted,
      onSetRepeatStrategy: this.setRepeatStrategy,
      onSetPlaybackRate: this.setPlaybackRate
    };
  }

  render () {
    return (
      <div
        className="rr_audio_player"
        title={getDisplayText(this.props.playlist, this.state.activeTrackIndex)}
        style={this.props.style}
      >
        {this.props.controls.map((control, index) => {
          const ControlComponent = getControlComponent(control);
          return ControlComponent && (
            <ControlComponent {...this.getControlProps(index)} />
          );
        })}
      </div>
    );
  }

}

AudioPlayer.propTypes = {
  playlist: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    displayText: PropTypes.string.isRequired
  }).isRequired),
  controls: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.oneOf([
      'playpause',
      'backskip',
      'forwardskip',
      'volume',
      'repeat',
      'progress',
      'progressdisplay',
      'spacer'
    ])
  ]).isRequired),
  autoplay: PropTypes.bool,
  autoplayDelayInSeconds: PropTypes.number,
  gapLengthInSeconds: PropTypes.number,
  crossOrigin: PropTypes.oneOf(['anonymous', 'use-credentials']),
  defaultVolume: PropTypes.number,
  defaultMuted: PropTypes.bool,
  defaultRepeatStrategy: PropTypes.oneOf(repeatStrategyOptions),
  defaultPlaybackRate: PropTypes.number,
  startingTime: PropTypes.number,
  startingTrackIndex: PropTypes.number,
  loadFirstTrackOnPlaylistComplete: PropTypes.bool,
  pauseOnSeekPreview: PropTypes.bool,
  stayOnBackSkipThreshold: PropTypes.number,
  style: PropTypes.object,
  onActiveTrackUpdate: PropTypes.func,
  onMediaEvent: PropTypes.objectOf(PropTypes.func.isRequired),
  audioElementRef: PropTypes.func
};

AudioPlayer.defaultProps = {
  controls: [
    'spacer',
    'backskip',
    'playpause',
    'forwardskip',
    'spacer',
    'progress'
  ],
  autoplay: false,
  autoplayDelayInSeconds: 0,
  gapLengthInSeconds: 0,
  defaultVolume: 1,
  defaultMuted: false,
  defaultRepeatStrategy: 'playlist',
  defaultPlaybackRate: 1,
  startingTime: 0,
  startingTrackIndex: 0,
  loadFirstTrackOnPlaylistComplete: true,
  pauseOnSeekPreview: false,
  stayOnBackSkipThreshold: 5
};

module.exports = AudioPlayer;
