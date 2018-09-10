import React, { Component } from 'react';
import PropTypes from 'prop-types';

import playerContextFilter from '../factories/playerContextFilter';
import * as PlayerPropTypes from '../PlayerPropTypes';

class VideoDisplay extends Component {
  componentDidMount () {
    this.endStream = this.props.pipeVideoStreamToCanvas(this.canvas);
  }

  componentWillUnmount () {
    this.endStream();
  }

  render () {
    const canvasAttributes = { ...this.props };
    delete canvasAttributes.pipeVideoStreamToCanvas;
    return <canvas {...canvasAttributes} ref={elem => this.canvas = elem} />;
  }
}

VideoDisplay.propTypes = {
  pipeVideoStreamToCanvas: PropTypes.func.isRequired
};

export default playerContextFilter(VideoDisplay, ['pipeVideoStreamToCanvas']);
