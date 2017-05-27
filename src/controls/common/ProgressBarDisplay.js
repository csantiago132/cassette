import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PurePropTypesComponent from './PurePropTypesComponent';

class ProgressBarDisplay extends PurePropTypesComponent {
  render () {
    const {
      className,
      progressClassName,
      style,
      progress,
      handle,
      onMouseDown,
      onTouchStart,
      progressBarRef
    } = this.props;
    return (
      <div
        ref={progressBarRef}
        className={className}
        style={style}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onClick={e => {
          e.stopPropagation();
          e.stopImmediatePropagation();
        }}
      >
        <div style={{ position: 'relative', height: '100%' }}>
          <div
            className={progressClassName}
            style={{
              height: '100%',
              willChange: 'width',
              width: `${(progress || 0) * 100}%`
            }}
          />
          {handle && (
            <div
              style={{
                position: 'absolute',
                willChange: 'left',
                left: `${(progress || 0) * 100}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
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
  handle: PropTypes.element,
  onMouseDown: PropTypes.func,
  onTouchStart: PropTypes.func,
  progressBarRef: PropTypes.func
};

module.exports = ProgressBarDisplay;
