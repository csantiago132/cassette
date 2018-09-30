import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ButtonWrapper from './common/ButtonWrapper';
import getVolumeIconComponent from '../utils/getVolumeIconComponent';
import playerContextFilter from '../factories/playerContextFilter';
import classNames from '../utils/classNames';

class MuteButton extends PureComponent {
  render() {
    const { volume, muted, onToggleMuted } = this.props;
    const VolumeIcon = getVolumeIconComponent(volume, muted);
    return (
      <ButtonWrapper>
        <button
          type="button"
          className={classNames(
            'rrap__material_toggle rrap__audio_button rrap__mute_btn',
            { on: !muted }
          )}
          onClick={onToggleMuted}
        >
          <div className="foreground inner">
            <VolumeIcon width="100%" height="100%" />
          </div>
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
