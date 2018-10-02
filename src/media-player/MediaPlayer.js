import React, { Component } from 'react';

import { PlayerContextProvider } from 'media-player-core';

import MediaPlayerControls from './MediaPlayerControls';

export class MediaPlayer extends Component {
  render() {
    const {
      getDisplayText,
      controls,
      fullscreenEnabled,
      showVideo,
      renderVideoDisplay,
      ...rest
    } = this.props;
    return (
      <PlayerContextProvider {...rest}>
        <MediaPlayerControls
          getDisplayText={getDisplayText}
          controls={controls}
          fullscreenEnabled={fullscreenEnabled}
          showVideo={showVideo}
          renderVideoDisplay={renderVideoDisplay}
        />
      </PlayerContextProvider>
    );
  }
}

MediaPlayer.propTypes = {
  ...PlayerContextProvider.propTypes,
  ...MediaPlayerControls.propTypes
};

MediaPlayer.defaultProps = {
  ...PlayerContextProvider.defaultProps,
  ...MediaPlayerControls.defaultProps
};

export default MediaPlayer;
