import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import playerContextFilter from '../factories/playerContextFilter';

class PlayPauseButton extends PureComponent {
  render() {
    const { paused, awaitingResumeOnSeekComplete, onTogglePause } = this.props;
    return (
      <button
        className={classNames('rrap__play_pause_button rrap__audio_button', {
          playing: !paused || awaitingResumeOnSeekComplete
        })}
        onClick={onTogglePause}
      >
        <div className="foreground">
          <div className="left" />
          <div className="right" />
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

export default playerContextFilter(PlayPauseButton, [
  'paused',
  'awaitingResumeOnSeekComplete',
  'onTogglePause'
]);
