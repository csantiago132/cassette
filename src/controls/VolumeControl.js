import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import PurePropTypesComponent from './common/PurePropTypesComponent';
import getVolumeIconClassName from '../utils/getVolumeIconClassName';

class VolumeControl extends PurePropTypesComponent {
  render () {
    const { volume, muted, onToggleMuted } = this.props;
    return (
      <div
        className="rr_audio_player__audio_button rr_audio_player__volume_control"
        onClick={onToggleMuted}
      >
        <div className={classNames(
          'foreground',
          getVolumeIconClassName(volume, muted)
        )} />
      </div>
    );
  }
}

VolumeControl.propTypes = {
  volume: PropTypes.number.isRequired,
  muted: PropTypes.bool.isRequired,
  onToggleMuted: PropTypes.func.isRequired
};

module.exports = VolumeControl;
