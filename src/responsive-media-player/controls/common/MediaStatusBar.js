import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { MaybeMarquee } from 'media-player-components';

import classNames from '../../utils/classNames';

export class MediaStatusBar extends PureComponent {
  render() {
    const { className, style, displayText, displayTime } = this.props;
    return (
      <div
        className={classNames('rrap__audio_status_bar', className)}
        style={style}
      >
        <div className="rrap__audio_info_marquee">
          <MaybeMarquee content={displayText} />
        </div>
        <div className="rrap__audio_time_progress">{displayTime}</div>
      </div>
    );
  }
}

MediaStatusBar.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  displayText: PropTypes.string.isRequired,
  displayTime: PropTypes.string.isRequired
};

export default MediaStatusBar;
