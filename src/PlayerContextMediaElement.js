import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as PlayerPropTypes from './PlayerPropTypes';

const loopchange = 'loopchange';
const srcrequest = 'srcrequest';

const backupVideoStyle = {
  position: 'fixed',
  top: 0,
  right: 0,
  maxWidth: '40vw',
  zIndex: 1,
  opacity: 1,
  transition: 'opacity 0.2s'
};

const backVideoStyleOnHover = {
  ...backupVideoStyle,
  opacity: 0.5
};

class PlayerContextMediaElement extends Component {
  constructor (props) {
    super(props);
    this.state = {
      hover: false
    };
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  componentDidMount () {
    const { mediaElement } = this;

    new MutationObserver(() => {
      mediaElement.dispatchEvent(new Event(loopchange));
    }).observe(mediaElement, {
      attributeFilter: ['loop']
    });

    // Don't let the mediaElement src property get modified directly.
    // Instead, when it does get set, dispatch an event to be
    // handled in a way that doesn't conflict with the loaded
    // playlist.
    Object.defineProperty(mediaElement, 'src', {
      get: () => mediaElement.currentSrc,
      set: src => {
        const e = new Event(srcrequest);
        e.srcRequested = src;
        mediaElement.dispatchEvent(e);
      }
    });

    this.props.elementRef(mediaElement);
  }

  handleMouseEnter () {
    this.setState({
      hover: true
    });
  }

  handleMouseLeave () {
    this.setState({
      hover: false
    });
  }

  render () {
    // Hide video unless streaming to another element is unsupported
    const hidden = Boolean(
      typeof window === 'undefined' ||
      HTMLVideoElement.prototype.captureStream
    );
    return (
      <video
        ref={elem => this.mediaElement = elem}
        hidden={hidden}
        style={hidden
          ? (
          this.state.hover
            ? backVideoStyleOnHover
            : backupVideoStyle
          )
          : undefined}
        crossOrigin={this.props.crossOrigin}
        preload="metadata"
        loop={this.props.loop}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.props.children}
      </video>
    );
  }
}

PlayerContextMediaElement.propTypes = {
  elementRef: PropTypes.func.isRequired,
  crossOrigin: PlayerPropTypes.crossOriginAttribute,
  loop: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default PlayerContextMediaElement;
