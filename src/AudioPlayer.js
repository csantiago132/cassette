import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import createCustomAudioElement from './factories/createCustomAudioElement';
import ShuffleManager from './utils/ShuffleManager';
import AudioPlayerContext from './utils/AudioPlayerContext';
import getSourceList from './utils/getSourceList';
import findTrackIndexByUrl from './utils/findTrackIndexByUrl';
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
      // whether to randomly pick next track from playlist after one finishes
      shuffle: props.defaultShuffle,
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

    // used to keep track of play history when we are shuffling
    this.shuffler = new ShuffleManager(getSourceList(props.playlist), {
      allowBackShuffle: props.allowBackShuffle
    });

    // passed to control components and compared for shouldComponentUpdate
    this.unknownProps = this.getUnknownProps(props);

    // used to communicate updates to descendant components via subscription
    this.audioPlayerContext = new AudioPlayerContext(
      this.getControlProps(props, this.state, this.unknownProps)
    );

    // html audio element used for playback
    this.audio = null;

    // bind methods fired on React events
    this.setAudioElementRef = this.setAudioElementRef.bind(this);
    this.togglePause = this.togglePause.bind(this);
    this.selectTrackIndex = this.selectTrackIndex.bind(this);
    this.forwardSkip = this.forwardSkip.bind(this);
    this.backSkip = this.backSkip.bind(this);
    this.seekPreview = this.seekPreview.bind(this);
    this.seekComplete = this.seekComplete.bind(this);
    this.setVolume = this.setVolume.bind(this);
    this.setVolumeComplete = this.setVolumeComplete.bind(this);
    this.toggleMuted = this.toggleMuted.bind(this);
    this.toggleShuffle = this.toggleShuffle.bind(this);
    this.setRepeatStrategy = this.setRepeatStrategy.bind(this);
    this.setPlaybackRate = this.setPlaybackRate.bind(this);

    // bind audio event listeners to add on mount and remove on unmount
    this.handleAudioPlay = this.handleAudioPlay.bind(this);
    this.handleAudioPause = this.handleAudioPause.bind(this);
    this.handleAudioSrcchange = this.handleAudioSrcchange.bind(this);
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
    const audio = this.audio = createCustomAudioElement(this.audio);

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
    audio.addEventListener('srcchange', this.handleAudioSrcchange);
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

    this.shuffler.setList(getSourceList(newPlaylist));
    this.shuffler.setOptions({
      allowBackShuffle: nextProps.allowBackShuffle
    });

    if (!isPlaylistValid(newPlaylist)) {
      this.audio.src = '';
      this.currentTrackIndex = 0;
      return this.setState(this.defaultState);
    }

    const oldPlaylist = this.props.playlist;

    const currentTrackUrl = ((oldPlaylist || [])[this.currentTrackIndex] || {}).url;
    if (
      currentTrackUrl !== (
        newPlaylist[this.currentTrackIndex] &&
        newPlaylist[this.currentTrackIndex].url
      )
    ) {
      this.currentTrackIndex = findTrackIndexByUrl(newPlaylist, currentTrackUrl);
      /* if the track we're already playing is in the new playlist, update the
       * activeTrackIndex.
       */
      if (this.currentTrackIndex !== -1) {
        this.setState({
          activeTrackIndex: this.currentTrackIndex
        });
      }
    }
  }

  // shouldComponentUpdate shouldn't really have side effects, but
  // there's not a great solution besides this one at the moment.
  // see: https://github.com/facebook/react/issues/9922
  shouldComponentUpdate (nextProps, nextState) {
    const lastUnknownProps = this.unknownProps;
    const nextUnknownProps = this.unknownProps = this.getUnknownProps(nextProps);
    this.audioPlayerContext.setControlProps(
      this.getControlProps(nextProps, nextState, nextUnknownProps)
    );
    if (
      React.Children.count(nextProps.children) === 0 ||
      this.props.children !== nextProps.children
    ) {
      return true;
    }
    for (const key of Object.keys(lastUnknownProps)) {
      if (!(key in nextUnknownProps)) {
        return true;
      }
    }
    for (const key of Object.keys(nextUnknownProps)) {
      if(!(lastUnknownProps[key] === nextUnknownProps[key])) {
        return true;
      }
    }
    // since we aren't going to render, we can go ahead
    // and trigger subscription updates.
    this.audioPlayerContext.notifySubscribers();
    return false;
  }

  componentDidUpdate (prevProps, prevState) {
    this.audioPlayerContext.notifySubscribers();

    if (typeof this.props.onRepeatStrategyUpdate === 'function') {
      const prevRepeatStrategy = getRepeatStrategy(
        prevState.loop,
        prevState.cycle
      );
      const newRepeatStrategy = getRepeatStrategy(
        this.state.loop,
        this.state.cycle
      );
      if (prevRepeatStrategy !== newRepeatStrategy) {
        this.props.onRepeatStrategyUpdate(newRepeatStrategy);
      }
    }

    /* if we loaded a new playlist and the currently playing track couldn't
     * be found, pause and load the first track in the new playlist.
     */
    if (this.currentTrackIndex === -1) {
      this.goToTrack(0, false);
    }
  }

  componentWillUnmount () {
    const { audio } = this;
    // remove event listeners on the audio element
    audio.removeEventListener('play', this.handleAudioPlay);
    audio.removeEventListener('pause', this.handleAudioPause);
    audio.removeEventListener('srcchange', this.handleAudioSrcchange);
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
  }

  getChildContext () {
    return {
      audioPlayer: this.audioPlayerContext
    };
  }

  setAudioElementRef (ref) {
    this.audio = ref;
    if (typeof this.props.audioElementRef === 'function') {
      this.props.audioElementRef(ref);
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

  handleAudioSrcchange () {
    const { playlist } = this.props;
    const currentTrackUrl = (
      playlist &&
      playlist[this.currentTrackIndex] &&
      playlist[this.currentTrackIndex].url
    );
    const newSrc = this.audio.src;
    if (currentTrackUrl === newSrc) {
      // we're good! nothing to update.
      return;
    }
    // looks like 'src' was set from outside our component. let's
    // see if we can use it or if we have to reset it.
    const newTrackIndex = findTrackIndexByUrl(playlist, newSrc);
    if (newTrackIndex === -1) {
      // this isn't in our playlist - use our latest state
      // to try to preserve everything how it was.
      this.audio.src = currentTrackUrl;
      this.audio.currentTime = this.state.currentTime;
      this.audio.playbackRate = this.state.playbackRate;
      this.audio[this.state.paused ? 'pause' : 'play']();
      logError(
        `Source '${newSrc}' does not exist in the loaded playlist. ` +
        `Make sure you've updated the 'playlist' prop to AudioPlayer ` +
        `before you select this track!`
      );
      return;
    }
    // even if our new track selection is fine, we'll need to
    // restore the playbackRate (at least until the HTML spec
    // changes to stop resetting it on source change).
    // https://github.com/whatwg/html/issues/2739
    this.audio.playbackRate = this.state.playbackRate;
    this.selectTrackIndex(newTrackIndex);
  }

  handleAudioEnded () {
    clearTimeout(this.gapLengthTimeout);
    const { playlist } = this.props;
    if (!isPlaylistValid(playlist)) {
      return;
    }
    if (!this.state.cycle && this.currentTrackIndex + 1 >= playlist.length) {
      if (this.props.loadFirstTrackOnPlaylistComplete) {
        this.goToTrack(0, false);
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
      onActiveTrackUpdate(this.currentTrackIndex);
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

  goToTrack (index, shouldPlay = true) {
    if (!isPlaylistValid(this.props.playlist)) {
      return;
    }
    const isNewTrack = this.currentTrackIndex !== index;
    this.currentTrackIndex = index;
    this.setState({
      activeTrackIndex: -1,
      currentTime: 0
    }, () => {
      this.updateSource();
      if (isNewTrack) {
        this.audio.loop = false;
        if (!this.state.shuffle) {
          this.shuffler.clear();
        }
      }
      this.togglePause(!shouldPlay);
    });
  }

  selectTrackIndex (index) {
    const { playlist } = this.props;
    if (!isPlaylistValid(playlist)) {
      return;
    }
    if (index < 0 || index > playlist.length) {
      logWarning(`Playlist index ${index} is out of bounds!`);
      return;
    }
    if (this.state.shuffle) {
      this.shuffler.pickNextItem(index, this.currentTrackIndex);
    }
    this.goToTrack(index);
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
    let index;
    if (this.state.shuffle) {
      const previousItem = this.shuffler.findPreviousItem(
        this.currentTrackIndex
      );
      if (previousItem === undefined) {
        // if we aren't allowing backShuffle then we'll hit a stopping point.
        audio.currentTime = 0;
        return;
      }
      index = findTrackIndexByUrl(playlist, previousItem);
    } else {
      index = this.currentTrackIndex - 1;
      if (index < 0) {
        index = playlist.length - 1;
      }
    }
    this.goToTrack(index);
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
    let index;
    if (this.state.shuffle) {
      index = findTrackIndexByUrl(
        playlist,
        this.shuffler.findNextItem(this.currentTrackIndex)
      );
    } else {
      index = this.currentTrackIndex + 1;
      if (index >= playlist.length) {
        index = 0;
      }
    }
    this.goToTrack(index);
  }

  seekPreview (targetTime) {
    if (this.isSeekUnavailable(this.state)) {
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

  toggleShuffle (value) {
    const shuffle = typeof value === 'boolean' ? value : !this.state.shuffle;
    this.setState({ shuffle });
    if (typeof this.props.onShuffleUpdate === 'function') {
      this.props.onShuffleUpdate(shuffle);
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

  isSeekUnavailable (state) {
    return Boolean(state.activeTrackIndex < 0);
  }

  getUnknownProps (props) {
    return Object.keys(props).reduce((memo, propName) => {
      if (!(propName in AudioPlayer.propTypes)) {
        memo[propName] = props[propName];
      }
      return memo;
    }, {});
  }

  getControlProps (props, state, unknownProps) {
    return {
      ...unknownProps,
      playlist: props.playlist,
      activeTrackIndex: state.activeTrackIndex,
      paused: state.paused,
      currentTime: state.currentTime,
      seekPreviewTime: state.seekPreviewTime,
      seekInProgress: state.seekInProgress,
      awaitingResumeOnSeekComplete: state.awaitingResumeOnSeekComplete,
      duration: state.duration,
      buffered: state.buffered,
      played: state.played,
      volume: state.volume,
      muted: state.muted,
      shuffle: state.shuffle,
      playbackRate: state.playbackRate,
      setVolumeInProgress: state.setVolumeInProgress,
      seekUnavailable: this.isSeekUnavailable(state),
      repeatStrategy: getRepeatStrategy(state.loop, state.cycle),
      onTogglePause: this.togglePause,
      onSelectTrackIndex: this.selectTrackIndex,
      onBackSkip: this.backSkip,
      onForwardSkip: this.forwardSkip,
      onSeekPreview: this.seekPreview,
      onSeekComplete: this.seekComplete,
      onSetVolume: this.setVolume,
      onSetVolumeComplete: this.setVolumeComplete,
      onToggleMuted: this.toggleMuted,
      onToggleShuffle: this.toggleShuffle,
      onSetRepeatStrategy: this.setRepeatStrategy,
      onSetPlaybackRate: this.setPlaybackRate
    };
  }

  render () {
    const { controlProps } = this.audioPlayerContext;
    const hasChildren = Boolean(React.Children.count(this.props.children));
    return (
      <div
        className="rrap"
        title={getDisplayText(this.props.playlist, this.state.activeTrackIndex)}
        style={this.props.style}
      >
        <audio ref={this.setAudioElementRef} />
        {hasChildren && this.props.children}
        {!hasChildren && this.props.controls.map((control, index) => {
          const ControlComponent = getControlComponent(control);
          return ControlComponent && (
            <ControlComponent {...controlProps} key={this.controlKeys[index]} />
          );
        })}
      </div>
    );
  }

}

AudioPlayer.childContextTypes = {
  audioPlayer: PropTypes.shape({
    controlProps: PropTypes.object.isRequired
  }).isRequired
};

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
      'shuffle',
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
  defaultShuffle: PropTypes.bool,
  defaultPlaybackRate: PropTypes.number,
  startingTime: PropTypes.number,
  startingTrackIndex: PropTypes.number,
  loadFirstTrackOnPlaylistComplete: PropTypes.bool,
  pauseOnSeekPreview: PropTypes.bool,
  allowBackShuffle: PropTypes.bool,
  stayOnBackSkipThreshold: PropTypes.number,
  style: PropTypes.object,
  onActiveTrackUpdate: PropTypes.func,
  onRepeatStrategyUpdate: PropTypes.func,
  onShuffleUpdate: PropTypes.func,
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
  defaultShuffle: false,
  defaultPlaybackRate: 1,
  startingTime: 0,
  startingTrackIndex: 0,
  loadFirstTrackOnPlaylistComplete: true,
  pauseOnSeekPreview: false,
  allowBackShuffle: false,
  stayOnBackSkipThreshold: 5
};

export default AudioPlayer;
