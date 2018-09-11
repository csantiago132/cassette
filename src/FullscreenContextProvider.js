import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';

import FullscreenContext from './FullscreenContext';

const fullscreenStyle = {
  width: '100%',
  height: '100%'
};

class FullscreenContextProvider extends PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      fullscreen: false
    };
    this.requestFullscreen = this.requestFullscreen.bind(this);
    this.requestExitFullscreen = this.requestExitFullscreen.bind(this);
    this.handleFullscreenChange = this.handleFullscreenChange.bind(this);
    this.fullscreenElement = createRef();
  }

  componentDidMount () {
    this.fullscreenElement.addEventListener(
      'fullscreenchange',
      this.handleFullscreenChange
    );
  }

  componentWillUnmount () {
    this.fullscreenElement.removeEventListener(
      'fullscreenchange',
      this.handleFullscreenChange
    );
  }

  requestFullscreen () {
    if (this.fullscreenElement.requestFullscreen) {
      this.fullscreenElement.requestFullscreen();
    } else if (this.fullscreenElement.webkitRequestFullscreen) {
      this.fullscreenElement.webkitRequestFullscreen();
    } else if (this.fullscreenElement.mozRequestFullscreen) {
      this.fullscreenElement.mozRequestFullscreen();
    }
  }

  requestExitFullscreen () {
    if (this.fullscreenElement.requestExitFullscreen) {
      this.fullscreenElement.requestExitFullscreen();
    } else if (this.fullscreenElement.webkitRequestExitFullscreen) {
      this.fullscreenElement.webkitRequestExitFullscreen();
    } else if (this.fullscreenElement.mozRequestExitFullscreen) {
      this.fullscreenElement.mozRequestExitFullscreen();
    }
  }

  handleFullscreenChange () {
    this.setState({
      fullscreen: document.fullscreenElement === this.fullscreenElement
    });
  }

  render () {
    const { fullscreen } = this.state;
    return (
      <div
        ref={this.fullscreenElement}
        style={fullscreen ? fullscreenStyle : undefined}
      >
        <FullscreenContext.Provider
          value={{
            fullscreen,
            requestFullscreen: this.requestFullscreen,
            requestExitFullscreen: this.requestExitFullscreen
          }}
        >
          {this.props.children}
        </FullscreenContext.Provider>
      </div>
    );
  }
}

FullscreenContextProvider.propTypes = {
  fullscreenEnabled: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};

FullscreenContextProvider.defaultProps = {
  fullscreenEnabled: true
};

export default FullscreenContextProvider;
