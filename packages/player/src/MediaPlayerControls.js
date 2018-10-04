import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  PlayerContextConsumer,
  FullscreenContextProvider,
  PlayerPropTypes
} from '@cassette/core';
import { VideoDisplay } from '@cassette/components';

import getDisplayText from './utils/getDisplayText';
import getControlRenderProp from './utils/getControlRenderProp';

import './styles/index.scss';

let nextControlKey = 0;
function getNextControlKey() {
  return (nextControlKey++).toString();
}

export class MediaPlayerControls extends Component {
  getKeyedChildren(elements) {
    // cache of keys to use in controls render
    // (to maintain state in case order changes)
    this.controlKeys = this.controlKeys || new Map();

    // counts of rendered elements by type
    const elementsRendered = new Map();

    return elements.map(element => {
      // support React | Preact | Inferno
      const type = element.type || element.nodeName || element.tag || '';

      // index within list of keys by type
      const keyIndex = elementsRendered.get(type) || 0;
      elementsRendered.set(type, keyIndex + 1);

      const keysForType = this.controlKeys.get(type) || [];

      let key;
      if (keysForType[keyIndex]) {
        key = keysForType[keyIndex];
      } else {
        key = getNextControlKey();
        this.controlKeys.set(type, keysForType.concat(key));
      }

      return element && React.cloneElement(element, { key });
    });
  }

  render() {
    const {
      getDisplayText,
      controls,
      fullscreenEnabled,
      showVideo,
      renderVideoDisplay
    } = this.props;

    return (
      <FullscreenContextProvider fullscreenEnabled={fullscreenEnabled}>
        {fullscreenContext => (
          <PlayerContextConsumer>
            {playerContext => (
              <div className="cassette">
                {showVideo &&
                  renderVideoDisplay(playerContext, fullscreenContext)}
                <div
                  className="cassette__control_bar"
                  title={getDisplayText(
                    playerContext.playlist[playerContext.activeTrackIndex]
                  )}
                >
                  {this.getKeyedChildren(
                    controls.map(control => {
                      const renderControl = getControlRenderProp(control);
                      return (
                        renderControl &&
                        renderControl(playerContext, fullscreenContext)
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </PlayerContextConsumer>
        )}
      </FullscreenContextProvider>
    );
  }
}

MediaPlayerControls.propTypes = {
  controls: PropTypes.arrayOf(PlayerPropTypes.control.isRequired).isRequired,
  getDisplayText: PropTypes.func.isRequired,
  fullscreenEnabled: PropTypes.bool.isRequired,
  showVideo: PropTypes.bool.isRequired,
  renderVideoDisplay: PropTypes.func.isRequired
};

MediaPlayerControls.defaultProps = {
  controls: [
    'spacer',
    'backskip',
    'playpause',
    'forwardskip',
    'spacer',
    'progress'
  ],
  getDisplayText: getDisplayText,
  fullscreenEnabled: true,
  showVideo: false,
  // eslint-disable-next-line no-unused-vars
  renderVideoDisplay(playerContext, fullscreenContext) {
    return (
      <VideoDisplay
        className="cassette__video_display_container"
        onClick={playerContext.onTogglePause}
      />
    );
  }
};

export default MediaPlayerControls;
