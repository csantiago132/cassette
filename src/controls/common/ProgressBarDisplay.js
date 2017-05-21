import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import PurePropTypesComponent from './PurePropTypesComponent';

class ProgressBarDisplay extends PurePropTypesComponent {
  render () {
    const {
      className,
      progress,
      onMouseDown,
      onTouchStart,
      progressBarRef
    } = this.props;
    return (
      <div
        ref={progressBarRef}
        className={classNames('progress_bar', className)}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <div
          style={{
            height: '100%',
            willChange: 'width',
            width: `${(progress || 0) * 100}%`
          }}
        />
      </div>
    );
  }
}

ProgressBarDisplay.propTypes = {
  className: PropTypes.string,
  progress: PropTypes.number.isRequired,
  onMouseDown: PropTypes.func,
  onTouchStart: PropTypes.func,
  progressBarRef: PropTypes.func
};

module.exports = ProgressBarDisplay;
