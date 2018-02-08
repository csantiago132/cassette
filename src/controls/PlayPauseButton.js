import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import createControlRenderProp from '../factories/createControlRenderProp';

class PlayPauseButton extends PureComponent {
  render () {
    const { paused, awaitingResumeOnSeekComplete, onTogglePause } = this.props;
    return (
      <button
        className={classNames(
          'rrap__play_pause_button rrap__audio_button',
          { paused: paused && !awaitingResumeOnSeekComplete }
        )}
        onClick={onTogglePause}
      >
        <div className="play_pause_inner foreground">
          <div className="left"></div>
          <div className="right"></div>
          <div className="triangle_1"></div>
          <div className="triangle_2"></div>
        </div>
      </button>
    );
  }
}

PlayPauseButton.propTypes = {
  paused: PropTypes.bool.isRequired,
  awaitingResumeOnSeekComplete: PropTypes.bool.isRequired,
  onTogglePause: PropTypes.func.isRequired
};

export const renderPlayPauseButton = createControlRenderProp(PlayPauseButton, [
  'paused',
  'awaitingResumeOnSeekComplete',
  'onTogglePause'
]);

export default PlayPauseButton;
