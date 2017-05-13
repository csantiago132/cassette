import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class PlayPauseButton extends Component {
  render () {
    const { paused, onTogglePause } = this.props;
    return (
      <div
        className={classNames('play_pause_button', 'audio_button', { paused })}
        onClick={onTogglePause}
      >
        <div className="play_pause_inner">
          <div className="left"></div>
          <div className="right"></div>
          <div className="triangle_1"></div>
          <div className="triangle_2"></div>
        </div>
      </div>
    );
  }
}

PlayPauseButton.propTypes = {
  paused: PropTypes.bool.isRequired,
  onTogglePause: PropTypes.func.isRequired,
};

module.exports = PlayPauseButton;
