import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ButtonWrapper from './common/ButtonWrapper';
import playerContextFilter from '../factories/playerContextFilter';

class PlayPauseButton extends PureComponent {
  render() {
    const { paused, awaitingResumeOnSeekComplete, onTogglePause } = this.props;
    return (
      <ButtonWrapper>
        <button
          type="button"
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
      </ButtonWrapper>
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
