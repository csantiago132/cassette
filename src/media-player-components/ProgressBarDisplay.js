import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { PlayerPropTypes } from 'media-player-core';

import getProgressStyle from './utils/getProgressStyle';
import getHandleStyle from './utils/getHandleStyle';

export class ProgressBarDisplay extends PureComponent {
  render() {
    const {
      className,
      progressClassName,
      style,
      progressStyle,
      progress,
      progressDirection,
      handle,
      onMouseDown,
      onTouchStart,
      onClick,
      progressBarRef
    } = this.props;
    return (
      <div
        ref={progressBarRef}
        className={className}
        style={style}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onClick={onClick}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            touchAction: 'none'
          }}
        >
          <div
            className={progressClassName}
            style={{
              ...getProgressStyle(progress, progressDirection),
              ...(progressStyle || {})
            }}
          />
          {handle && (
            <div style={getHandleStyle(progress, progressDirection)}>
              {handle}
            </div>
          )}
        </div>
      </div>
    );
  }
}

ProgressBarDisplay.propTypes = {
  className: PropTypes.string,
  progressClassName: PropTypes.string,
  style: PropTypes.object,
  progressStyle: PropTypes.object,
  progress: PropTypes.number.isRequired,
  progressDirection: PlayerPropTypes.progressDirection.isRequired,
  handle: PropTypes.element,
  onMouseDown: PropTypes.func,
  onTouchStart: PropTypes.func,
  onClick: PropTypes.func,
  progressBarRef: PropTypes.func
};

export default ProgressBarDisplay;
