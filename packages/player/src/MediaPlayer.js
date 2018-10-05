import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  PlayerContextProvider,
  FullscreenContextProvider
} from '@cassette/core';

import MediaPlayerControls from './MediaPlayerControls';

export class MediaPlayer extends Component {
  render() {
    const {
      getDisplayText,
      controls,
      showVideo,
      renderVideoDisplay,
      fullscreenEnabled,
      ...rest
    } = this.props;
    return (
      <FullscreenContextProvider fullscreenEnabled={fullscreenEnabled}>
        <PlayerContextProvider {...rest}>
          <MediaPlayerControls
            getDisplayText={getDisplayText}
            controls={controls}
            showVideo={showVideo}
            renderVideoDisplay={renderVideoDisplay}
          />
        </PlayerContextProvider>
      </FullscreenContextProvider>
    );
  }
}

MediaPlayer.propTypes = {
  ...PlayerContextProvider.propTypes,
  ...MediaPlayerControls.propTypes,
  fullscreenEnabled: PropTypes.bool.isRequired
};

MediaPlayer.defaultProps = {
  ...PlayerContextProvider.defaultProps,
  ...MediaPlayerControls.defaultProps,
  fullscreenEnabled: true
};

export default MediaPlayer;
