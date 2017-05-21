import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import classNames from 'classnames';

import ProgressBar from './common/ProgressBar';
import convertToTime from '../utils/convertToTime';
import getDisplayText from '../utils/getDisplayText';
import convertToNumberWithinIntervalBounds from '../utils/convertToNumberWithinIntervalBounds';

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
      <div className="audio_progress_container">
        <ProgressBar
          className="audio_progress_bar"
          progress={displayedProgress}
          adjusting={seekInProgress}
          readonly={seekUnavailable}
          onAdjustProgress={this.handleSeekPreview}
          onAdjustComplete={onSeekComplete}
        />
        <div className="audio_progress_overlay" style={{ pointerEvents: 'none' }}>
          <div className="audio_info_marquee">
            <div className="audio_info noselect" draggable="false">
              {getDisplayText(playlist, activeTrackIndex)}
            </div>
          </div>
          <div className="audio_time_progress noselect" draggable="false">
            {`${convertToTime(time)} / ${convertToTime(duration)}`}
          </div>
        </div>
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
