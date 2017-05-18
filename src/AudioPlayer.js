import React, { Component, PropTypes } from 'react';
import arrayFindIndex from 'array-find-index';
import classNames from 'classnames';

import createAudioElementWithLoopEvent from './factories/createAudioElementWithLoopEvent';
import isPlaylistValid from './utils/isPlaylistValid';
import getDisplayText from './utils/getDisplayText';
import getControlComponent from './utils/getControlComponent';
import convertToNumberWithinIntervalBounds from './utils/convertToNumberWithinIntervalBounds';

import './index.scss';

const log = console.log.bind(console);
const logError = console.error ? console.error.bind(console) : log;
const logWarning = console.warn ? console.warn.bind(console) : log;

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
 * Accepts 'disableSeek' prop (default false,
 * disables seeking through the audio if true).
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
      // the latest volume of the audio, between 0 and 1.
      volume: 1.0,
      // true if the audio has been muted
      muted: false,
      // the duration in seconds of the loaded track
      duration: 0,
      /* the TimeRanges object representing the buffered sections of the
       * loaded track
       */
      buffered: null,
      /* the TimeRanges object representing the played sections of the
       * loaded track
       */
      played: null,
      // whether to loop the current track
      loop: false,
      // Rate at which audio should be played. 1.0 is normal speed.
      playbackRate: 1.0
    };

    this.state = this.defaultState;

    // index matching requested track (whether track has loaded or not)
    this.currentTrackIndex = 0;

    // html audio element used for playback
    this.audio = null;

    // bind methods fired on React events
    this.togglePause = this.togglePause.bind(this);
    this.selectTrackIndex = this.selectTrackIndex.bind(this);
    this.skipToNextTrack = this.skipToNextTrack.bind(this);
    this.backSkip = this.backSkip.bind(this);
    this.seekPreview = this.seekPreview.bind(this);
    this.seekComplete = this.seekComplete.bind(this);
    this.setVolume = this.setVolume.bind(this);
    this.toggleMuted = this.toggleMuted.bind(this);
    this.toggleLoop = this.toggleLoop.bind(this);
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
    /* if we loaded a new playlist and reset the current track marker, we
     * should load up the first one.
     */
    if (this.currentTrackIndex === -1) {
      this.skipToNextTrack(false);
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
    const { playlist, cycle } = this.props;
    if (!isPlaylistValid(playlist)) {
      return;
    }
    if (!cycle && this.currentTrackIndex + 1 >= playlist.length) {
      if (this.props.loadFirstTrackOnPlaylistComplete) {
        this.selectTrackIndex(0, false);
      }
      return;
    }
    this.gapLengthTimeout = setTimeout(
      this.skipToNextTrack,
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
    const { playlist } = this.props;
    if (!isPlaylistValid(playlist)) {
      this.audio.src = '';
      return;
    }
    this.audio.src = playlist[this.currentTrackIndex].url;
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
    this.currentTrackIndex = index;
    this.setState({
      activeTrackIndex: -1,
      currentTime: 0
    }, () => {
      this.updateSource();
      this.togglePause(!shouldPlay);
    });
  }

  skipToNextTrack (shouldPlay = true) {
    const { playlist } = this.props;
    if (!isPlaylistValid(playlist)) {
      return;
    }
    let index = this.currentTrackIndex + 1;
    if (index >= playlist.length) {
      index = 0;
    }
    this.selectTrackIndex(index, shouldPlay);
  }

  backSkip () {
    const { playlist, stayOnBackSkipThreshold } = this.props;
    const { audio } = this;
    if (!isPlaylistValid(playlist)) {
      return;
    }
    if (audio.currentTime >= stayOnBackSkipThreshold) {
      audio.currentTime = 0;
      return;
    }
    let index = this.currentTrackIndex - 1;
    if (index < 0) {
      index = playlist.length - 1;
    }
    this.selectTrackIndex(index);
  }

  seekPreview (progress) {
    const { paused, awaitingResumeOnSeekComplete } = this.state;
    if (this.isSeekUnavailable()) {
      return;
    }
    if (!paused && this.props.pauseOnSeekPreview && !awaitingResumeOnSeekComplete) {
      this.setState({
        awaitingResumeOnSeekComplete: true
      });
      this.togglePause(true);
    }
    const progressInBounds = convertToNumberWithinIntervalBounds(progress, 0, 1);
    this.setState({
      seekPreviewTime: progressInBounds * this.audio.duration,
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
      audio.play();
      this.setState({
        awaitingResumeOnSeekComplete: false
      });
    }
  }

  setVolume (volume) {
    this.audio.volume = convertToNumberWithinIntervalBounds(volume, 0, 1);
  }

  toggleMuted (value) {
    const muted = typeof value === 'boolean' ? value : !this.state.muted;
    this.audio.muted = muted;
  }

  toggleLoop (value) {
    const loop = typeof value === 'boolean' ? value : !this.state.loop;
    this.audio.loop = loop;
  }

  setPlaybackRate (rate) {
    this.audio.playbackRate = rate;
  }

  isSeekUnavailable () {
    const { audio } = this;
    return Boolean(!(audio && audio.src) || this.props.disableSeek);
  }

  render () {
    const { playlist, controls, style } = this.props;
    return (
      <div
        className="audio_player"
        title={getDisplayText(playlist, this.state.activeTrackIndex)}
        style={style}
      >
        {controls.map((control, index) => {
          const ControlComponent = getControlComponent(control);
          if (!ControlComponent) {
            return null;
          }
          return (
            <ControlComponent
              key={index}
              playlist={playlist}
              seekUnavailable={this.isSeekUnavailable()}
              onTogglePause={this.togglePause}
              onSelectTrackIndex={this.selectTrackIndex}
              onBackSkip={this.backSkip}
              onForwardSkip={this.skipToNextTrack}
              onSeekPreview={this.seekPreview}
              onSeekComplete={this.seekComplete}
              onSetVolume={this.setVolume}
              onToggleMuted={this.toggleMuted}
              onToggleLoop={this.toggleLoop}
              onSetPlaybackRate={this.setPlaybackRate}
              {...this.state}
            />
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
    PropTypes.element,
    PropTypes.oneOf([
      'playpause',
      'backskip',
      'forwardskip',
      'progress',
      'spacer'
    ])
  ]).isRequired),
  autoplay: PropTypes.bool,
  autoplayDelayInSeconds: PropTypes.number,
  gapLengthInSeconds: PropTypes.number,
  cycle: PropTypes.bool,
  loadFirstTrackOnPlaylistComplete: PropTypes.bool,
  pauseOnSeekPreview: PropTypes.bool,
  disableSeek: PropTypes.bool,
  stayOnBackSkipThreshold: PropTypes.number,
  style: PropTypes.object,
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
  cycle: true,
  loadFirstTrackOnPlaylistComplete: true,
  pauseOnSeekPreview: false,
  disableSeek: false,
  stayOnBackSkipThreshold: 5
};

module.exports = AudioPlayer;
