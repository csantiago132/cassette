import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import PurePropTypesComponent from './common/PurePropTypesComponent';
import ProgressBar from './common/ProgressBar';
import getVolumeIconClassName from '../utils/getVolumeIconClassName';
import getVolumeBarDirectionFromPosition from '../utils/getVolumeBarDirectionFromPosition';

const handle = <div className="handle"><div /></div>;

class VolumeControl extends PurePropTypesComponent {
  constructor (props) {
    super(props);

    this.state = {
      hover: false,
      // null | 'hiddenup' | 'hiddenright' | 'upabove' | 'rightabove' | 'rightbelow'
      volumeBarPosition: null
    };

    this.volumeControlRef = null;
    this.volumeBarContainerRef = null;

    // bind methods fired on React events
    this.setVolumeControlRef = this.setVolumeControlRef.bind(this);
    this.setVolumeBarContainerRef = this.setVolumeBarContainerRef.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    const { hover, volumeBarPosition } = this.state;
    if (volumeBarPosition && !hover && !nextProps.setVolumeInProgress) {
      this.setState({
        volumeBarPosition: null
      });
    }
  }

  componentDidUpdate () {
    /* if we've applied a hidden class to our volume bar, it's because
     * we need to measure the element dimensions in order to figure out
     * where and in which direction to position it. if there isn't enough
     * vertical space above the control button, then we'll position the
     * bar hidden and left-to-right to measure it again on the next
     * componentDidUpdate. then if there's room we'll place it either
     * above or below (there's no good way to vertically position the
     * volume bar below the control button, so we skip that option).
     * granted - it's certainly not ideal to need to check dom dimensions
     * before placing an element, but a user could have applied unanticipated
     * styles we won't know about unless we check.
     */
    const { volumeBarPosition } = this.state;
    if (
      volumeBarPosition === 'hiddenup' ||
      volumeBarPosition === 'hiddenright'
    ) {
      const volumeControlRect = this.volumeControlRef.getBoundingClientRect();
      const top = volumeControlRect.top;
      const volumeBarContainerHeight = this.volumeBarContainerRef.offsetHeight;
      let newPosition;
      if (volumeBarPosition === 'hiddenup') {
        newPosition = volumeBarContainerHeight <= top ? 'upabove' : 'hiddenright';
      } else {
        if (volumeBarContainerHeight <= top) {
          newPosition = 'rightabove';
        } else {
          const viewportHeight = document.documentElement.clientHeight;
          const bottom = viewportHeight - volumeControlRect.bottom;
          newPosition = volumeBarContainerHeight <= bottom ? 'rightbelow' : null;
        }
      }
      this.setState({
        volumeBarPosition: newPosition
      });
    }
  }

  setVolumeControlRef (ref) {
    this.volumeControlRef = ref;
  }

  setVolumeBarContainerRef (ref) {
    this.volumeBarContainerRef = ref;
  }

  handleMouseEnter () {
    this.setState({
      hover: true,
      volumeBarPosition: this.state.volumeBarPosition || 'hiddenup'
    });
  }

  handleMouseLeave () {
    this.setState({
      hover: false,
      volumeBarPosition: (
        this.props.setVolumeInProgress ? this.state.volumeBarPosition : null
      )
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
    const { volumeBarPosition } = this.state;
    return (
      <div
        ref={this.setVolumeControlRef}
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
        {volumeBarPosition && (
          <div
            ref={this.setVolumeBarContainerRef}
            className={classNames(
              'rr_audio_player__volume_control__volume_bar_container',
              volumeBarPosition
            )}
          >
            <ProgressBar
              className={classNames(
                'rr_audio_player__volume_control__volume_bar',
                volumeBarPosition
              )}
              progressClassName="volume"
              progress={muted ? 0 : volume}
              progressDirection={getVolumeBarDirectionFromPosition(volumeBarPosition)}
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
