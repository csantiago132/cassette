import React, { Component, Fragment, createElement } from 'react';
import PropTypes from 'prop-types';
import arrayFindIndex from 'array-find-index';

import PlayerContext from './PlayerContext';
import GroupContext from './GroupContext';
import * as PlayerPropTypes from './PlayerPropTypes';
import createCustomMediaElement from './factories/createCustomMediaElement';
import ShuffleManager from './utils/ShuffleManager';
import { getStateSnapshot, restoreStateFromSnapshot } from './utils/snapshot';
import getSourceList from './utils/getSourceList';
import getTrackSources from './utils/getTrackSources';
import getTimeRangesArray from './utils/getTimeRangesArray';
import findTrackIndexByUrl from './utils/findTrackIndexByUrl';
import isPlaylistValid from './utils/isPlaylistValid';
import getRepeatStrategy from './utils/getRepeatStrategy';
import convertToNumberWithinIntervalBounds from './utils/convertToNumberWithinIntervalBounds';
import streamVideoElementToCanvas from './utils/streamVideoElementToCanvas';
import { logError, logWarning } from './utils/console';
import { repeatStrategyOptions } from './constants';

function playErrorHandler(err) {
  logError(err);
  if (err.name === 'NotAllowedError') {
    const warningMessage =
      'Media playback failed at ' +
      new Date().toLocaleTimeString() +
      '! (Perhaps autoplay is disabled in this browser.)';
    logWarning(warningMessage);
  }
}

// Existing Media Session API implementations have default handlers
// for play/pause, and may yield unexpected behavior if custom
// play/pause handlers are defined - so let's leave them be.
const supportableMediaSessionActions = [
  'previoustrack',
  'nexttrack',
  'seekbackward',
  'seekforward'
];

// media element readyState
const HAVE_NOTHING = 0;

const defaultState = {
  // indicates whether media player should be paused
  paused: true,
  // elapsed time for active track, in seconds
  currentTime: 0,
  // The most recent targeted time, in seconds, for seek preview
  seekPreviewTime: 0,
  /* true if the user is currently dragging the mouse
   * to seek a new track position
   */
  seekInProgress: false,
  /* true if media was playing when seek previewing began,
   * it was paused, and it should be resumed on seek
   * complete
   */
  awaitingResumeOnSeekComplete: false,
  // the duration in seconds of the loaded track
  duration: 0,
  // array describing the buffered ranges in the loaded track
  bufferedRanges: [],
  // array describing the already-played ranges in the loaded track
  playedRanges: [],
  // array describing the seekable ranges in the loaded track
  seekableRanges: [],
  // true if the media is currently stalled pending data buffering
  stalled: false,
  // true if the active track should play on the next componentDidUpdate
  awaitingPlay: false
};

// assumes playlist is valid
function getGoToTrackState(prevState, index, shouldPlay = true) {
  const isNewTrack = prevState.activeTrackIndex !== index;
  return {
    activeTrackIndex: index,
    trackLoading: isNewTrack,
    currentTime: 0,
    loop: isNewTrack ? false : prevState.loop,
    awaitingPlay: Boolean(shouldPlay),
    paused: !shouldPlay
  };
}

/**
 * Wraps an area which shares a common [`playerContext`](#playercontext)
 */
export class PlayerContextProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...defaultState,
      // index matching requested track (whether track has loaded or not)
      activeTrackIndex: convertToNumberWithinIntervalBounds(
        props.startingTrackIndex,
        0
      ),
      // whether we're waiting on loading metadata for the active track
      trackLoading: isPlaylistValid(props.playlist),
      // the current timestamp on the active track in seconds
      currentTime: convertToNumberWithinIntervalBounds(props.startingTime, 0),
      // the latest volume of the media, between 0 and 1.
      volume: convertToNumberWithinIntervalBounds(props.defaultVolume, 0, 1),
      // true if the media has been muted
      muted: props.defaultMuted,
      // whether to loop the active track
      loop: props.defaultRepeatStrategy === 'track',
      // true if playlist should continue at start after completion
      cycle: props.defaultRepeatStrategy === 'playlist',
      // whether to randomly pick next track from playlist after one finishes
      shuffle: props.defaultShuffle,
      // Rate at which media should be played. 1.0 is normal speed.
      playbackRate: props.defaultPlaybackRate,
      // true if user is currently dragging mouse to change the volume
      setVolumeInProgress: false,
      // initialize awaitingPlay from autoplay prop
      awaitingPlay: props.autoplay && isPlaylistValid(props.playlist),
      // playlist prop copied to state (for getDerivedStateFromProps)
      __playlist__: props.playlist,
      // load overrides from previously-captured state snapshot
      ...(props.initialStateSnapshot
        ? restoreStateFromSnapshot(props.initialStateSnapshot, props)
        : {})
    };

    // volume at last time we were unmuted and not actively setting volume
    this.lastStableVolume = this.state.volume;

    // used to keep track of play history when we are shuffling
    this.shuffler = new ShuffleManager(getSourceList(props.playlist), {
      allowBackShuffle: props.allowBackShuffle
    });

    // html media element used for playback
    this.media = null;

    this.setMediaElementRef = this.setMediaElementRef.bind(this);

    // bind callback methods to pass to descendant elements
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
    this.pipeVideoStreamToCanvas = this.pipeVideoStreamToCanvas.bind(this);

    // bind media event handlers
    this.handleMediaPlay = this.handleMediaPlay.bind(this);
    this.handleMediaPause = this.handleMediaPause.bind(this);
    this.handleMediaSrcrequest = this.handleMediaSrcrequest.bind(this);
    this.handleMediaEnded = this.handleMediaEnded.bind(this);
    this.handleMediaStalled = this.handleMediaStalled.bind(this);
    this.handleMediaCanplaythrough = this.handleMediaCanplaythrough.bind(this);
    this.handleMediaTimeupdate = this.handleMediaTimeupdate.bind(this);
    this.handleMediaLoadedmetadata = this.handleMediaLoadedmetadata.bind(this);
    this.handleMediaVolumechange = this.handleMediaVolumechange.bind(this);
    this.handleMediaDurationchange = this.handleMediaDurationchange.bind(this);
    this.handleMediaProgress = this.handleMediaProgress.bind(this);
    this.handleMediaLoopchange = this.handleMediaLoopchange.bind(this);
    this.handleMediaRatechange = this.handleMediaRatechange.bind(this);
  }

  componentDidMount() {
    const media = (this.media = createCustomMediaElement(this.media));

    // initialize media properties
    if (media.readyState !== HAVE_NOTHING) {
      // we only set the currentTime now if we're beyond the
      // HAVE_NOTHING readyState. Otherwise we'll let this get
      // set when the loadedmetadata event fires. This avoids
      // an issue where some browsers ignore or delay currentTime
      // updates when in the HAVE_NOTHING state.
      media.currentTime = this.state.currentTime;
    }
    media.volume = this.state.volume;
    media.muted = this.state.muted;
    media.defaultPlaybackRate = this.props.defaultPlaybackRate;
    media.playbackRate = this.state.playbackRate;

    // add special event listeners on the media element
    media.addEventListener('srcrequest', this.handleMediaSrcrequest);
    media.addEventListener('loopchange', this.handleMediaLoopchange);

    if (this.state.awaitingPlay) {
      this.setState({
        awaitingPlay: false
      });
      this.delayTimeout = setTimeout(() => {
        this.togglePause(false);
      }, this.props.autoplayDelayInSeconds * 1000);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const newPlaylist = nextProps.playlist;

    if (newPlaylist === prevState.__playlist__) {
      // reference comparison is equal so we'll
      // assume the playlist is unchanged.
      return null;
    }

    const baseNewState = {
      __playlist__: newPlaylist
    };

    // check if the new playlist is invalid
    if (!isPlaylistValid(newPlaylist)) {
      return {
        ...defaultState,
        ...baseNewState,
        activeTrackIndex: 0,
        trackLoading: false
      };
    }

    // check if the activeTrackIndex doesn't need to be updated
    const prevSources = getTrackSources(
      prevState.__playlist__,
      prevState.activeTrackIndex
    );
    // the sources if we stay on the same track index
    const currentSources = getTrackSources(
      newPlaylist,
      prevState.activeTrackIndex
    );
    // non-comprehensive but probably accurate check
    if (prevSources[0].src === currentSources[0].src) {
      // our active track index already matches
      return baseNewState;
    }

    /* if the track we're already playing is in the new playlist, update the
     * activeTrackIndex.
     */
    const newTrackIndex = findTrackIndexByUrl(newPlaylist, prevSources[0].src);
    if (newTrackIndex !== -1) {
      return {
        ...baseNewState,
        activeTrackIndex: newTrackIndex
      };
    }

    // if not, then load the first track in the new playlist, and pause.
    return {
      ...baseNewState,
      ...getGoToTrackState(prevState, 0, false)
    };
  }

  componentDidUpdate(prevProps, prevState) {
    this.media.defaultPlaybackRate = this.props.defaultPlaybackRate;

    this.shuffler.setList(getSourceList(this.props.playlist));
    this.shuffler.setOptions({
      allowBackShuffle: this.props.allowBackShuffle
    });

    const prevSources = getTrackSources(
      prevProps.playlist,
      prevState.activeTrackIndex
    );
    const newSources = getTrackSources(
      this.props.playlist,
      this.state.activeTrackIndex
    );
    if (prevSources[0].src !== newSources[0].src) {
      // cancel playback and re-scan current sources
      this.media.load();

      if (!this.state.shuffle) {
        // after toggling off shuffle, we defer clearing the shuffle
        // history until we actually change tracks - if the user quickly
        // toggles  shuffle off then back on again, we don't want to have
        // lost our history.
        this.shuffler.clear();
      }
    }

    if (prevProps !== this.props && !this.media.paused) {
      // update running media session based on new props
      this.stealMediaSession();
    }

    if (this.state.awaitingPlay) {
      this.setState({
        awaitingPlay: false
      });
      // media.currentSrc is updated asynchronously so we should
      // play async to avoid weird intermediate state issues
      setTimeout(() => {
        this.togglePause(false);
      });
    }

    clearTimeout(this.snapshotUpdateTimeout);
    this.snapshotUpdateTimeout = setTimeout(() => {
      if (this.props.onStateSnapshot) {
        this.props.onStateSnapshot(getStateSnapshot(this.state));
      }
    }, 100);
  }

  componentWillUnmount() {
    const { media } = this;
    // remove special event listeners on the media element
    media.removeEventListener('srcrequest', this.handleMediaSrcrequest);
    media.removeEventListener('loopchange', this.handleMediaLoopchange);

    clearTimeout(this.gapLengthTimeout);
    clearTimeout(this.delayTimeout);
  }

  setMediaElementRef(ref) {
    this.media = ref;
    if (typeof this.props.mediaElementRef === 'function') {
      this.props.mediaElementRef(ref);
    }
  }

  stealMediaSession() {
    if (
      // eslint-disable-next-line no-undef
      !(window.MediaSession && navigator.mediaSession instanceof MediaSession)
    ) {
      return;
    }
    // eslint-disable-next-line no-undef
    navigator.mediaSession.metadata = new MediaMetadata(
      this.props.playlist[this.state.activeTrackIndex]
    );
    supportableMediaSessionActions
      .map(action => {
        if (this.props.supportedMediaSessionActions.indexOf(action) === -1) {
          return null;
        }
        const seekLength = this.props.mediaSessionSeekLengthInSeconds;
        switch (action) {
          case 'play':
            return this.togglePause.bind(this, false);
          case 'pause':
            return this.togglePause.bind(this, true);
          case 'previoustrack':
            return this.backSkip;
          case 'nexttrack':
            return this.forwardSkip;
          case 'seekbackward':
            return () => (this.media.currentTime -= seekLength);
          case 'seekforward':
            return () => (this.media.currentTime += seekLength);
          default:
            return undefined;
        }
      })
      .forEach((handler, i) => {
        navigator.mediaSession.setActionHandler(
          supportableMediaSessionActions[i],
          handler
        );
      });
  }

  pipeVideoStreamToCanvas(canvas, callback) {
    return streamVideoElementToCanvas(this.media, canvas, callback);
  }

  handleMediaPlay() {
    this.setState(state => (state.paused === false ? null : { paused: false }));
    this.stealMediaSession();
  }

  handleMediaPause() {
    this.setState(state => (state.paused === true ? null : { paused: true }));
  }

  handleMediaSrcrequest(e) {
    const { playlist } = this.props;
    const sources = getTrackSources(playlist, this.state.activeTrackIndex);
    if (arrayFindIndex(sources, s => s.src === e.srcRequested) !== -1) {
      // we're good! nothing to update.
      return;
    }
    // looks like 'src' was set from outside our component.
    // let's see if we can use it.
    const newTrackIndex = findTrackIndexByUrl(playlist, e.srcRequested);
    if (newTrackIndex === -1) {
      logError(
        `Source '${e.srcRequested}' does not exist in the loaded playlist. ` +
          `Make sure you've updated the 'playlist' prop to ` +
          `PlayerContextProvider before you select this track!`
      );
      return;
    }
    this.selectTrackIndex(newTrackIndex);
  }

  handleMediaEnded() {
    if (this.state.seekInProgress) {
      // nothing to do if we're in the middle of a seek
      // (this can happen if we're in seekMode: immediate)
      return;
    }
    clearTimeout(this.gapLengthTimeout);
    const { playlist, loadFirstTrackOnPlaylistComplete } = this.props;
    if (!isPlaylistValid(playlist)) {
      return;
    }
    const { cycle, activeTrackIndex } = this.state;
    if (!cycle && activeTrackIndex + 1 >= playlist.length) {
      if (loadFirstTrackOnPlaylistComplete) {
        this.goToTrack(0, false);
      }
      return;
    }
    this.gapLengthTimeout = setTimeout(
      this.forwardSkip,
      this.props.gapLengthInSeconds * 1000
    );
  }

  handleMediaStalled() {
    this.setState(state => (state.stalled === true ? null : { stalled: true }));
  }

  handleMediaCanplaythrough() {
    this.setState(
      state => (state.stalled === false ? null : { stalled: false })
    );
  }

  handleMediaTimeupdate() {
    const { currentTime, played } = this.media;
    this.setState({
      currentTime,
      playedRanges: getTimeRangesArray(played)
    });
  }

  handleMediaLoadedmetadata() {
    if (this.media.currentTime !== this.state.currentTime) {
      this.media.currentTime = this.state.currentTime;
    }
    this.setState(
      state => (state.trackLoading === false ? null : { trackLoading: false })
    );
  }

  handleMediaVolumechange() {
    const { volume, muted } = this.media;
    this.setState({ volume, muted });
  }

  handleMediaDurationchange() {
    const { duration } = this.media;
    this.setState({ duration });
  }

  handleMediaProgress() {
    this.setState({
      bufferedRanges: getTimeRangesArray(this.media.buffered),
      seekableRanges: getTimeRangesArray(this.media.seekable)
    });
  }

  handleMediaLoopchange() {
    const { loop } = this.media;
    this.setState(state => (state.loop === loop ? null : { loop }));
  }

  handleMediaRatechange() {
    const { playbackRate } = this.media;
    this.setState(
      state => (state.playbackRate === playbackRate ? null : { playbackRate })
    );
  }

  togglePause(value) {
    clearTimeout(this.delayTimeout);
    const pause = typeof value === 'boolean' ? value : !this.state.paused;
    if (pause) {
      this.media.pause();
      return;
    }
    if (!this.media.currentSrc) {
      return;
    }
    try {
      const playPromise = this.media.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise
          .catch(err => {
            // AbortError is pretty much always called because we're skipping
            // tracks quickly or hitting pause before a track has a chance to
            // play. It's pretty safe to just ignore these error messages.
            if (err.name !== 'AbortError') {
              return Promise.reject(err);
            }
          })
          .catch(playErrorHandler);
      }
    } catch (err) {
      playErrorHandler(err);
    }
  }

  // assumes playlist is valid - don't call without checking
  goToTrack(index, shouldPlay = true) {
    clearTimeout(this.delayTimeout);
    this.setState(state => getGoToTrackState(state, index, shouldPlay));
  }

  selectTrackIndex(index) {
    const { playlist } = this.props;
    if (!isPlaylistValid(playlist)) {
      return;
    }
    if (index < 0 || index > playlist.length) {
      logWarning(`Playlist index ${index} is out of bounds!`);
      return;
    }
    if (this.state.shuffle) {
      this.shuffler.pickNextItem(index, this.state.activeTrackIndex);
    }
    this.goToTrack(index);
  }

  backSkip() {
    const { playlist, stayOnBackSkipThreshold } = this.props;
    const { media } = this;
    const { cycle, activeTrackIndex, shuffle } = this.state;
    if (
      !isPlaylistValid(playlist) ||
      media.currentTime >= stayOnBackSkipThreshold ||
      (!cycle && activeTrackIndex < 1)
    ) {
      media.currentTime = 0;
      return;
    }
    let index;
    if (shuffle) {
      const previousItem = this.shuffler.findPreviousItem(activeTrackIndex);
      if (previousItem === undefined) {
        // if we aren't allowing backShuffle then we'll hit a stopping point.
        media.currentTime = 0;
        return;
      }
      index = findTrackIndexByUrl(playlist, previousItem);
    } else {
      index = activeTrackIndex - 1;
      if (index < 0) {
        index = playlist.length - 1;
      }
    }
    this.goToTrack(index);
  }

  forwardSkip() {
    const { playlist } = this.props;
    const { cycle, activeTrackIndex, shuffle } = this.state;
    if (
      !isPlaylistValid(playlist) ||
      (!cycle && activeTrackIndex + 1 >= playlist.length)
    ) {
      return;
    }
    let index;
    if (shuffle) {
      index = findTrackIndexByUrl(
        playlist,
        this.shuffler.findNextItem(activeTrackIndex)
      );
    } else {
      index = activeTrackIndex + 1;
      if (index >= playlist.length) {
        index = 0;
      }
    }
    this.goToTrack(index);
  }

  seekPreview(targetTime) {
    if (!isPlaylistValid(this.props.playlist)) {
      return;
    }
    const baseStateUpdate = {
      seekPreviewTime: targetTime,
      seekInProgress: true
    };
    switch (this.props.seekMode) {
      case 'paused':
        this.setState(({ paused, awaitingResumeOnSeekComplete }) => ({
          ...baseStateUpdate,
          awaitingResumeOnSeekComplete: paused
            ? awaitingResumeOnSeekComplete
            : true
        }));
        this.media.currentTime = targetTime;
        if (!this.state.paused) {
          this.togglePause(true);
        }
        break;
      case 'immediate':
        this.setState(({ paused, awaitingResumeOnSeekComplete }) => ({
          ...baseStateUpdate,
          awaitingResumeOnSeekComplete: paused
            ? awaitingResumeOnSeekComplete
            : true
        }));
        this.media.currentTime = targetTime;
        if (this.state.awaitingResumeOnSeekComplete && !this.media.ended) {
          // if we earlier encountered an 'ended' state,
          // un-pausing becomes necessary to resume playback
          this.togglePause(false);
        }
        break;
      case 'onrelease':
        this.setState(baseStateUpdate);
        break;
    }
  }

  seekComplete(targetTime) {
    const { seekPreviewTime, awaitingResumeOnSeekComplete } = this.state;
    const baseStateUpdate = {
      seekInProgress: false,
      awaitingResumeOnSeekComplete: false
    };
    const currentTime =
      typeof targetTime === 'number' ? targetTime : seekPreviewTime;

    if (isNaN(currentTime)) {
      this.setState(baseStateUpdate);
      return;
    }
    this.setState({
      ...baseStateUpdate,
      /* we'll update currentTime on the media listener hook anyway,
       * but that might not happen for a bit... so the optimistic update
       * helps us avoid the progress bar jumping around and confusing the user.
       * https://github.com/benwiley4000/cassette/issues/209
       */
      currentTime
    });
    this.media.currentTime = currentTime;
    if (awaitingResumeOnSeekComplete) {
      if (this.media.ended) {
        this.forwardSkip();
      } else {
        this.togglePause(false);
      }
    }
  }

  setVolume(volume, inProgress = true) {
    if (inProgress && !this.state.setVolumeInProgress) {
      this.setState({
        setVolumeInProgress: true
      });
    }
    const volumeInBounds = convertToNumberWithinIntervalBounds(volume, 0, 1);
    this.media.muted = volumeInBounds === 0 ? true : false;
    this.media.volume = volumeInBounds;
  }

  setVolumeComplete(volume) {
    if (typeof volume === 'number') {
      this.setVolume(volume, false);
    }
    this.setState({
      setVolumeInProgress: false
    });
    if (!this.media.muted) {
      this.lastStableVolume = this.media.volume;
    }
  }

  toggleMuted(value) {
    const muted = typeof value === 'boolean' ? value : !this.state.muted;
    this.media.muted = muted;
    if (!muted) {
      this.media.volume = this.lastStableVolume;
    }
  }

  toggleShuffle(value) {
    const shuffle = typeof value === 'boolean' ? value : !this.state.shuffle;
    this.setState({ shuffle });
  }

  setRepeatStrategy(repeatStrategy) {
    if (repeatStrategyOptions.indexOf(repeatStrategy) === -1) {
      logWarning(
        'repeatStrategy "' +
          repeatStrategy +
          '" is not one of: ' +
          repeatStrategyOptions.split(', ') +
          '.'
      );
      return;
    }
    this.setState(() => {
      switch (repeatStrategy) {
        case 'track':
          return {
            loop: true
          };
        case 'playlist':
          return {
            loop: false,
            cycle: true
          };
        case 'none':
          return {
            loop: false,
            cycle: false
          };
        default:
          return null;
      }
    });
  }

  setPlaybackRate(rate) {
    this.media.playbackRate = rate;
  }

  getControlProps() {
    const { props, state } = this;
    const playerContext = {
      playlist: props.playlist,
      activeTrackIndex: state.activeTrackIndex,
      trackLoading: state.trackLoading,
      paused: state.paused,
      currentTime: state.currentTime,
      seekPreviewTime: state.seekPreviewTime,
      seekInProgress: state.seekInProgress,
      awaitingResumeOnSeekComplete: state.awaitingResumeOnSeekComplete,
      duration: state.duration,
      bufferedRanges: state.bufferedRanges,
      playedRanges: state.playedRanges,
      seekableRanges: state.seekableRanges,
      volume: state.volume,
      muted: state.muted,
      shuffle: state.shuffle,
      stalled: state.stalled,
      playbackRate: state.playbackRate,
      setVolumeInProgress: state.setVolumeInProgress,
      repeatStrategy: getRepeatStrategy(state.loop, state.cycle),
      pipeVideoStreamToCanvas: this.pipeVideoStreamToCanvas,
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
    if (this.playerContext) {
      // only update this.playerContext if something has changed
      for (const key of Object.keys(this.playerContext)) {
        if (playerContext[key] !== this.playerContext[key]) {
          this.playerContext = playerContext;
          break;
        }
      }
    } else {
      // first time - nothing to compare
      this.playerContext = playerContext;
    }
    return this.playerContext;
  }

  render() {
    const sources = getTrackSources(
      this.props.playlist,
      this.state.activeTrackIndex
    );
    const playerContext = this.getControlProps();
    return (
      <Fragment>
        <video
          hidden
          playsInline
          ref={this.setMediaElementRef}
          crossOrigin={this.props.crossOrigin}
          preload="metadata"
          loop={this.state.loop}
          onPlay={this.handleMediaPlay}
          onPause={this.handleMediaPause}
          onEnded={this.handleMediaEnded}
          onStalled={this.handleMediaStalled}
          onCanPlayThrough={this.handleMediaCanplaythrough}
          onTimeUpdate={this.handleMediaTimeupdate}
          onLoadedMetadata={this.handleMediaLoadedmetadata}
          onVolumeChange={this.handleMediaVolumechange}
          onDurationChange={this.handleMediaDurationchange}
          onProgress={this.handleMediaProgress}
          onRateChange={this.handleMediaRatechange}
        >
          {sources.map(source => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
        <PlayerContext.Provider value={playerContext}>
          {typeof this.props.children === 'function'
            ? this.props.children(playerContext)
            : this.props.children}
        </PlayerContext.Provider>
      </Fragment>
    );
  }
}

PlayerContextProvider.propTypes = {
  playlist: PropTypes.arrayOf(PlayerPropTypes.track.isRequired).isRequired,
  autoplay: PropTypes.bool.isRequired,
  autoplayDelayInSeconds: PropTypes.number.isRequired,
  gapLengthInSeconds: PropTypes.number.isRequired,
  crossOrigin: PlayerPropTypes.crossOriginAttribute,
  defaultVolume: PropTypes.number.isRequired,
  defaultMuted: PropTypes.bool,
  defaultRepeatStrategy: PlayerPropTypes.repeatStrategy.isRequired,
  defaultShuffle: PropTypes.bool,
  defaultPlaybackRate: PropTypes.number.isRequired,
  startingTime: PropTypes.number.isRequired,
  startingTrackIndex: PropTypes.number.isRequired,
  loadFirstTrackOnPlaylistComplete: PropTypes.bool,
  seekMode: PlayerPropTypes.seekMode.isRequired,
  maintainPlaybackRate: PropTypes.bool.isRequired,
  allowBackShuffle: PropTypes.bool,
  stayOnBackSkipThreshold: PropTypes.number.isRequired,
  supportedMediaSessionActions: PropTypes.arrayOf(
    PlayerPropTypes.mediaSessionAction.isRequired
  ).isRequired,
  mediaSessionSeekLengthInSeconds: PropTypes.number.isRequired,
  mediaElementRef: PropTypes.func,
  initialStateSnapshot: PropTypes.shape({
    __unstable__: PropTypes.object.isRequired
  }),
  onStateSnapshot: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired
};

PlayerContextProvider.defaultProps = {
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
  seekMode: 'immediate',
  maintainPlaybackRate: false,
  allowBackShuffle: false,
  stayOnBackSkipThreshold: 5,
  supportedMediaSessionActions: ['play', 'pause', 'previoustrack', 'nexttrack'],
  mediaSessionSeekLengthInSeconds: 10
};

export class PlayerContextGroupMember extends Component {
  componentDidMount() {
    this.props.groupContext.registerMediaElement(this.mediaElement);
  }

  componentWillUnmount() {
    this.props.groupContext.unregisterMediaElement(this.mediaElement);
  }

  render() {
    const { groupContext, props } = this.props;
    const { mediaElementRef, ...rest } = props;
    return (
      <PlayerContextProvider
        {...groupContext.groupProps}
        {...rest}
        mediaElementRef={ref => {
          if (mediaElementRef) {
            mediaElementRef(ref);
          }
          this.mediaElement = ref;
        }}
      />
    );
  }
}

PlayerContextGroupMember.propTypes = {
  groupContext: PropTypes.shape({
    groupProps: PropTypes.object.isRequired,
    registerMediaElement: PropTypes.func.isRequired,
    unregisterMediaElement: PropTypes.func.isRequired
  }).isRequired
};

function PlayerContextGroupConsumer(props) {
  return (
    <GroupContext.Consumer>
      {groupContext => {
        if (!groupContext) {
          return createElement(PlayerContextProvider, props);
        }
        return createElement(PlayerContextGroupMember, {
          groupContext,
          props
        });
      }}
    </GroupContext.Consumer>
  );
}

export default PlayerContextGroupConsumer;
