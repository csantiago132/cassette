import React, { Component } from 'react';
import PropTypes from 'prop-types';

import GroupContext from './GroupContext';

class PlayerContextGroup extends Component {
  constructor (props) {
    super(props);
    this.registerMediaElement = this.registerMediaElement.bind(this);
    this.unregisterMediaElement = this.unregisterMediaElement.bind(this);
    this.enforceOneAudioSourceOnly = this.enforceOneAudioSourceOnly.bind(this);
    this.mediaElements = [];
  }

  registerMediaElement (elem) {
    this.mediaElements = this.mediaElements.concat(elem);
    elem.addEventListener('play', this.enforceOneAudioSourceOnly, true);
    elem.addEventListener('volumechange', this.enforceOneAudioSourceOnly, true);
  }

  unregisterMediaElement (elem) {
    this.mediaElements = this.mediaElements.filter(element => elem !== element);
    elem.removeEventListener('play', this.enforceOneAudioSourceOnly, true);
    elem.removeEventListener('volumechange', this.enforceOneAudioSourceOnly, true);
  }

  enforceOneAudioSourceOnly (e) {
    const mediaElement = e.target;
    const { paused, muted } = mediaElement;
    if (paused || muted) {
      return;
    }
    for (const element of this.mediaElements) {
      if (element !== mediaElement) {
        element.pause();
      }
    }
  }

  render () {
    return (
      <GroupContext.Provider
        value={{
          groupProps: this.props,
          registerMediaElement: this.registerMediaElement,
          unregisterMediaElement: this.unregisterMediaElement
        }}
      >
        {this.props.children}
      </GroupContext.Provider>
    );
  }
}

PlayerContextGroup.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PlayerContextGroup;
