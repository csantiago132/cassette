import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import PurePropTypesComponent from './common/PurePropTypesComponent';
import ProgressBar from './common/ProgressBar';
import getVolumeIconClassName from '../utils/getVolumeIconClassName';

const handle = <div className="handle"><div /></div>;

class VolumeControl extends PurePropTypesComponent {
  constructor (props) {
    super(props);

    this.state = {
      hover: false
    };

    // bind methods fired on React events
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleMouseEnter () {
    this.setState({
      hover: true
    });
  }

  handleMouseLeave () {
    this.setState({
      hover: false
    });
  }

  render () {
    const {
      volume,
      muted,
      setVolumeInProgress,
      onSetVolume,
      onSetVolumeComplete,
      onToggleMuted
    } = this.props;
    return (
      <div
        className="rr_audio_player__volume_control"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div
          className="button rr_audio_player__audio_button"
          onClick={onToggleMuted}
        >
          <div className={classNames(
            'foreground',
            getVolumeIconClassName(volume, muted)
          )} />
        </div>
        {(this.state.hover || setVolumeInProgress) && (
          <div className="rr_audio_player__volume_control__volume_bar_container">
            <ProgressBar
              className="rr_audio_player__volume_control__volume_bar"
              progressClassName="volume"
              progress={muted ? 0 : volume}
              progressDirection="up"
              handle={handle}
              adjusting={setVolumeInProgress}
              onAdjustProgress={onSetVolume}
              onAdjustComplete={onSetVolumeComplete}
            />
          </div>
        )}
      </div>
    );
  }
}

VolumeControl.propTypes = {
  volume: PropTypes.number.isRequired,
  muted: PropTypes.bool.isRequired,
  setVolumeInProgress: PropTypes.bool.isRequired,
  onSetVolume: PropTypes.func.isRequired,
  onSetVolumeComplete: PropTypes.func.isRequired,
  onToggleMuted: PropTypes.func.isRequired
};

module.exports = VolumeControl;
