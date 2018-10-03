import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { PlayerPropTypes } from '@cassette/core';

import getProgressStyle from './utils/getProgressStyle';
import getHandleStyle from './utils/getHandleStyle';

export const ProgressBarDisplay = forwardRef(
  (
    {
      progressClassName,
      progressStyle,
      progress,
      progressDirection,
      handle,
      ...rest
    },
    ref
  ) => {
    return (
      <div {...rest} ref={ref}>
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
);

ProgressBarDisplay.propTypes = {
  progressClassName: PropTypes.string,
  progressStyle: PropTypes.object,
  progress: PropTypes.number.isRequired,
  progressDirection: PlayerPropTypes.progressDirection.isRequired,
  handle: PropTypes.element
};

export default ProgressBarDisplay;
