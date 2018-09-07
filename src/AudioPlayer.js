import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import PlayerContextProvider from './PlayerContextProvider';
import PlayerContext from './PlayerContext';
import * as PlayerPropTypes from './PlayerPropTypes';
import AudioControlBar from './controls/AudioControlBar';
import getDisplayText from './utils/getDisplayText';
import getControlRenderProp from './utils/getControlRenderProp';

import './styles/index.scss';

let nextControlKey = 0;
function getNextControlKey () {
  return (nextControlKey++).toString();
}

class AudioPlayer extends Component {
  getKeyedChildren (elements) {
    if (typeof Map === 'undefined') {
      // If we don't have a map, then we'll just let components get
      // re-mounted on re-order, which should be okay most of the time
      return elements.map((element, i) => {
        return element && React.cloneElement(element, { key: i });
      });
    }

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

  render () {
    const {
      style,
      getDisplayText,
      controls,
      controlWrapper: ControlWrapper,
      playerContext: ancestorPlayerContext,
      ...rest
    } = this.props;

    const audioPlayer = playerContext => (
      <div style={style}>
        <ControlWrapper
          title={getDisplayText(playerContext.playlist[playerContext.activeTrackIndex])}
        >
          {this.getKeyedChildren(
            controls.map((control, index) => {
              const renderControl = getControlRenderProp(control);
              return renderControl && renderControl(playerContext);
            })
          )}
        </ControlWrapper>
      </div>
    );

    if (ancestorPlayerContext) {
      return audioPlayer(ancestorPlayerContext);
    }
    return (
      <PlayerContextProvider {...rest}>
        <PlayerContext.Consumer>
          {playerContext => audioPlayer(playerContext)}
        </PlayerContext.Consumer>
      </PlayerContextProvider>
    );
  }
}

AudioPlayer.propTypes = {
  controls: PropTypes.arrayOf(PlayerPropTypes.control.isRequired).isRequired,
  controlWrapper: PropTypes.func.isRequired,
  getDisplayText: PropTypes.func.isRequired,
  style: PropTypes.object,
  playerContext: PropTypes.object
};

AudioPlayer.defaultProps = {
  controls: [
    'spacer',
    'backskip',
    'playpause',
    'forwardskip',
    'spacer',
    'progress'
  ],
  controlWrapper: AudioControlBar,
  getDisplayText: getDisplayText
};

export default AudioPlayer;
