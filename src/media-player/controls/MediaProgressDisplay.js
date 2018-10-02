import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ProgressBarDisplay } from 'media-player-components';
import { playerContextFilter, PlayerPropTypes } from 'media-player-core';

import MediaStatusBar from './common/MediaStatusBar';
import convertToTime from '../utils/convertToTime';
import getDisplayText from '../utils/getDisplayText';

const mediaStatusBarStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0
};

export class MediaProgressDisplay extends Component {
  render() {
    const { playlist, activeTrackIndex, currentTime, duration } = this.props;
    const progress = duration ? currentTime / duration : 0;
    return (
      <div className="rrap__media_progress_container">
        <ProgressBarDisplay
          className="rrap__media_progress_bar"
          progressClassName="progress"
          progress={progress}
        />
        <MediaStatusBar
          style={mediaStatusBarStyle}
          displayText={getDisplayText(playlist[activeTrackIndex]) || ''}
          displayTime={`${convertToTime(currentTime)} / ${convertToTime(
            duration
          )}`}
        />
      </div>
    );
  }
}

MediaProgressDisplay.propTypes = {
  playlist: PropTypes.arrayOf(PlayerPropTypes.track.isRequired).isRequired,
  activeTrackIndex: PropTypes.number.isRequired,
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired
};

export default playerContextFilter(MediaProgressDisplay, [
  'playlist',
  'activeTrackIndex',
  'currentTime',
  'duration'
]);
