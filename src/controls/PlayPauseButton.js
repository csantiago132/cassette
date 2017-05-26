import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import PurePropTypesComponent from './common/PurePropTypesComponent';

class PlayPauseButton extends PurePropTypesComponent {
  render () {
    const { paused, awaitingResumeOnSeekComplete, onTogglePause } = this.props;
    return (
      <div
        className={classNames(
          'rr_audio_player__play_pause_button rr_audio_player__audio_button',
          { paused: paused && !awaitingResumeOnSeekComplete }
        )}
        onClick={onTogglePause}
      >
        <div className="play_pause_inner">
          <div className="left foreground"></div>
          <div className="right foreground"></div>
          <div className="triangle_1"></div>
          <div className="triangle_2"></div>
        </div>
      </div>
    );
  }
}

PlayPauseButton.propTypes = {
  paused: PropTypes.bool.isRequired,
  awaitingResumeOnSeekComplete: PropTypes.bool.isRequired,
  onTogglePause: PropTypes.func.isRequired
};

module.exports = PlayPauseButton;
