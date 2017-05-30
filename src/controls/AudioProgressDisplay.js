import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ProgressBarDisplay from './common/ProgressBarDisplay';
import AudioStatusBar from './common/AudioStatusBar';
import convertToTime from '../utils/convertToTime';
import getDisplayText from '../utils/getDisplayText';

const audioStatusBarStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0
};

class AudioProgressDisplay extends Component {
  render () {
    const { playlist, activeTrackIndex, currentTime, duration } = this.props;
    const progress = duration ? currentTime / duration : 0;
    return (
      <div className="rr_audio_player__audio_progress_container">
        <ProgressBarDisplay
          className="rr_audio_player__audio_progress_bar"
          progressClassName="progress"
          progress={progress}
        />
        <AudioStatusBar
          style={audioStatusBarStyle}
          displayText={getDisplayText(playlist, activeTrackIndex) || ''}
          displayTime={`${convertToTime(currentTime)} / ${convertToTime(duration)}`}
        />
      </div>
    );
  }
}

AudioProgressDisplay.propTypes = {
  playlist: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    displayText: PropTypes.string.isRequired
  }).isRequired),
  activeTrackIndex: PropTypes.number.isRequired,
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired
};

module.exports = AudioProgressDisplay;
