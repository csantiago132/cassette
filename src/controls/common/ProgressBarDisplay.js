import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PurePropTypesComponent from './PurePropTypesComponent';
import getProgressStyle from '../../utils/getProgressStyle';
import getHandleStyle from '../../utils/getHandleStyle';

class ProgressBarDisplay extends PurePropTypesComponent {
  render () {
    const {
      className,
      progressClassName,
      style,
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
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          touchAction: 'none'
        }}>
          <div
            className={progressClassName}
            style={getProgressStyle(progress, progressDirection)}
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
  progress: PropTypes.number.isRequired,
  progressDirection: PropTypes.oneOf(['left', 'right', 'up', 'down']).isRequired,
  handle: PropTypes.element,
  onMouseDown: PropTypes.func,
  onTouchStart: PropTypes.func,
  onClick: PropTypes.func,
  progressBarRef: PropTypes.func
};

module.exports = ProgressBarDisplay;
