import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ButtonWrapper from './common/ButtonWrapper';
import getVolumeIconClassName from '../utils/getVolumeIconClassName';
import playerContextFilter from '../factories/playerContextFilter';

class MuteButton extends PureComponent {
  render() {
    const { volume, muted, onToggleMuted } = this.props;
    return (
      <ButtonWrapper className="rrap__volume_control">
        <button
          type="button"
          className="button rrap__audio_button rrap__mute_btn"
          onClick={onToggleMuted}
        >
          <div
            className={classNames(
              'foreground',
              getVolumeIconClassName(volume, muted)
            )}
          />
        </button>
      </ButtonWrapper>
    );
  }
}

MuteButton.propTypes = {
  volume: PropTypes.number.isRequired,
  muted: PropTypes.bool.isRequired,
  onToggleMuted: PropTypes.func.isRequired
};

export default playerContextFilter(MuteButton, [
  'volume',
  'muted',
  'onToggleMuted'
]);
