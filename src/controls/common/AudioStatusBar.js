import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import PurePropTypesComponent from './PurePropTypesComponent';

class AudioStatusBar extends PurePropTypesComponent {
  render () {
    const { className, style, displayText, displayTime } = this.props;
    return (
      <div
        className={classNames('rr_audio_player__audio_progress_overlay', className)}
        style={style}
      >
        <div className="rr_audio_player__audio_info_marquee">
          <div className="rr_audio_player__audio_info">{displayText}</div>
        </div>
        <div className="rr_audio_player__audio_time_progress">{displayTime}</div>
      </div>
    );
  }
}

AudioStatusBar.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  displayText: PropTypes.string.isRequired,
  displayTime: PropTypes.string.isRequired
};

module.exports = AudioStatusBar;
