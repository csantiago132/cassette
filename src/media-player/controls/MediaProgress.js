import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { ProgressBar } from 'media-player-components';
import { playerContextFilter, PlayerPropTypes } from 'media-player-core';
import { isPlaylistValid } from 'media-player-core/_undocumented';

import MediaStatusBar from './common/MediaStatusBar';
import convertToTime from '../utils/convertToTime';
import getDisplayText from '../utils/getDisplayText';

const mediaStatusBarStyle = {
  pointerEvents: 'none'
};

export class MediaProgress extends PureComponent {
  constructor(props) {
    super(props);

    // bind methods fired on React events
    this.handleSeekPreview = this.handleSeekPreview.bind(this);
  }

  handleSeekPreview(progress) {
    this.props.onSeekPreview(progress * this.props.duration);
  }

  render() {
    const {
      playlist,
      activeTrackIndex,
      currentTime,
      seekPreviewTime,
      seekInProgress,
      duration,
      onSeekComplete
    } = this.props;
    const time = seekInProgress ? seekPreviewTime : currentTime;
    const displayedProgress = duration ? time / duration : 0;
    return (
      <div className="cassette__media_progress_container">
        <ProgressBar
          className="cassette__media_progress_bar"
          progressClassName="progress"
          progress={displayedProgress}
          progressDirection="right"
          adjusting={seekInProgress}
          readonly={!isPlaylistValid(playlist)}
          onAdjustProgress={this.handleSeekPreview}
          onAdjustComplete={onSeekComplete}
        />
        <MediaStatusBar
          style={mediaStatusBarStyle}
          displayText={getDisplayText(playlist[activeTrackIndex]) || ''}
          displayTime={`${convertToTime(time)} / ${convertToTime(duration)}`}
        />
      </div>
    );
  }
}

MediaProgress.propTypes = {
  playlist: PropTypes.arrayOf(PlayerPropTypes.track.isRequired).isRequired,
  activeTrackIndex: PropTypes.number.isRequired,
  currentTime: PropTypes.number.isRequired,
  seekPreviewTime: PropTypes.number.isRequired,
  seekInProgress: PropTypes.bool.isRequired,
  duration: PropTypes.number.isRequired,
  onSeekPreview: PropTypes.func.isRequired,
  onSeekComplete: PropTypes.func.isRequired
};

export default playerContextFilter(MediaProgress, [
  'playlist',
  'activeTrackIndex',
  'currentTime',
  'seekPreviewTime',
  'seekInProgress',
  'duration',
  'onSeekPreview',
  'onSeekComplete'
]);
