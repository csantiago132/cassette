import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import classNames from 'classnames';

import ProgressBar from './common/ProgressBar';
import AudioStatusBar from './common/AudioStatusBar';
import convertToTime from '../utils/convertToTime';
import getDisplayText from '../utils/getDisplayText';
import convertToNumberWithinIntervalBounds from '../utils/convertToNumberWithinIntervalBounds';

const audioStatusBarStyle = {
  pointerEvents: 'none',
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0
};

class AudioProgress extends Component {
  constructor (props) {
    super(props);

    // bind methods fired on React events
    this.handleSeekPreview = this.handleSeekPreview.bind(this);
  }

  handleSeekPreview (progress) {
    this.props.onSeekPreview(progress * this.props.duration);
  }

  render () {
    const {
      playlist,
      activeTrackIndex,
      currentTime,
      seekPreviewTime,
      seekInProgress,
      seekUnavailable,
      duration,
      onSeekComplete
    } = this.props;
    const time = seekInProgress ? seekPreviewTime : currentTime;
    const displayedProgress = duration ? time / duration : 0;
    return (
      <div className="rr_audio_player__audio_progress_container">
        <ProgressBar
          className="rr_audio_player__audio_progress_bar"
          progress={displayedProgress}
          adjusting={seekInProgress}
          readonly={seekUnavailable}
          onAdjustProgress={this.handleSeekPreview}
          onAdjustComplete={onSeekComplete}
        />
        <AudioStatusBar
          style={audioStatusBarStyle}
          displayText={getDisplayText(playlist, activeTrackIndex) || ''}
          displayTime={`${convertToTime(time)} / ${convertToTime(duration)}`}
        />
      </div>
    );
  }
}

AudioProgress.propTypes = {
  playlist: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    displayText: PropTypes.string.isRequired
  }).isRequired),
  activeTrackIndex: PropTypes.number.isRequired,
  currentTime: PropTypes.number.isRequired,
  seekPreviewTime: PropTypes.number.isRequired,
  seekInProgress: PropTypes.bool.isRequired,
  seekUnavailable: PropTypes.bool.isRequired,
  duration: PropTypes.number.isRequired,
  onSeekPreview: PropTypes.func.isRequired,
  onSeekComplete: PropTypes.func.isRequired
};

module.exports = AudioProgress;
