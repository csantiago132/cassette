import React, { Component } from 'react';
import PropTypes from 'prop-types';

import playerContextFilter from '../factories/playerContextFilter';
import * as PlayerPropTypes from '../PlayerPropTypes';

class VideoDisplay extends Component {
  componentDidMount () {
    let warnedAboutNoImageData = false;
    this.endStream = this.props.pipeVideoStreamToCanvas(this.canvas, ctx => {
      const { width, height } = this.canvas;
      if (this.props.processFrame && width && height) {
        const frameData = ctx.getImageData(0, 0, width, height);
        const newFrameData = this.props.processFrame(frameData);
        if (!(newFrameData instanceof ImageData)) {
          if (!warnedAboutNoImageData) {
            console.warn(
              'The processFrame function should return an ImageData instance. ' +
              'Normally you\'ll just mutate the provided ImageData and return it.'
            );
            warnedAboutNoImageData = true;
          }
        } else {
          ctx.putImageData(newFrameData, 0, 0);
        }
      }
    });
  }

  componentWillUnmount () {
    this.endStream();
  }

  render () {
    const canvasAttributes = { ...this.props };
    delete canvasAttributes.pipeVideoStreamToCanvas;
    delete canvasAttributes.processFrame;
    return <canvas {...canvasAttributes} ref={elem => this.canvas = elem} />;
  }
}

VideoDisplay.propTypes = {
  /* TODO: for documentation
  We might want to use this grayscale function in an example
    processFrame: function (frameData) {
      for (let i = 0; i < frameData.data.length; i += 4) {
        const r = frameData.data[i + 0];
        const g = frameData.data[i + 1];
        const b = frameData.data[i + 2];

        // convert to grayscale (average)
        const avg = (((r + g) >> 1) + b) >> 1;
        frameData.data[i + 0] = avg;
        frameData.data[i + 1] = avg;
        frameData.data[i + 2] = avg;
      }
      return frameData;
    }
  */
  pipeVideoStreamToCanvas: PropTypes.func.isRequired,
  processFrame: PropTypes.func
};

export default playerContextFilter(VideoDisplay, ['pipeVideoStreamToCanvas']);
