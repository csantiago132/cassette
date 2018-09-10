import React, { Component } from 'react';
import PropTypes from 'prop-types';

import playerContextFilter from '../factories/playerContextFilter';
import * as PlayerPropTypes from '../PlayerPropTypes';
import { logWarning } from '../utils/console';

class VideoDisplay extends Component {
  componentDidMount () {
    this.checkForBadStuff();
    const { displayWidth, displayHeight } = this.getDeviceDisplayDimensions();
    const {
      endStream,
      setCanvasSize
    } = this.props.pipeVideoStreamToCanvas(this.canvas, ctx => {
      this.handleFrameUpdate(ctx);
    });
    setCanvasSize(displayWidth, displayHeight);
    this.endStream = endStream;
    this.setCanvasSize = setCanvasSize;
  }

  componentDidUpdate () {
    this.checkForBadStuff();
    const { displayWidth, displayHeight } = this.getDeviceDisplayDimensions();
    this.setCanvasSize(displayWidth, displayHeight);
  }

  componentWillUnmount () {
    this.endStream();
  }

  checkForBadStuff () {
    if (
      !this.warnedAboutBadStuff &&
      this.props.processFrame &&
      !this.props.displayWidth &&
      !this.props.displayHeight
    ) {
      logWarning(
        'VideoDisplay: Supplying a processFrame function without also ' +
        'giving a displayWidth or displayHeight means the video will be ' +
        'processed at the full resolution. This may lead to a poor framerate.'
      );
      this.warnedAboutBadStuff = true;
    }
  }

  getDeviceDisplayDimensions () {
    const { displayWidth, displayHeight, scaleForDevicePixelRatio } = this.props;
    const scale = scaleForDevicePixelRatio && window.devicePixelRatio || 1;
    return {
      displayWidth: displayWidth && (scale * displayWidth),
      displayHeight: displayHeight && (scale * displayHeight)
    };
  }

  handleFrameUpdate (canvasContext) {
    const { width, height } = this.canvas;
    if (!(this.props.processFrame && width && height)) {
      return;
    }
    const frameData = canvasContext.getImageData(0, 0, width, height);
    const newFrameData = this.props.processFrame(frameData);
    if (newFrameData instanceof ImageData) {
      canvasContext.putImageData(newFrameData, 0, 0);
      return;
    }
    if (!this.warnedAboutNoImageData) {
      logWarning(
        'The processFrame function should return an ImageData object. ' +
        'Normally you\'ll just mutate the provided ImageData and ' +
        'return it.'
      );
      this.warnedAboutNoImageData = true;
    }
  }

  render () {
    const canvasAttributes = { ...this.props };
    delete canvasAttributes.pipeVideoStreamToCanvas;
    delete canvasAttributes.processFrame;
    delete canvasAttributes.displayWidth;
    delete canvasAttributes.displayHeight;
    delete canvasAttributes.scaleForDevicePixelRatio;
    return <canvas {...canvasAttributes} ref={elem => this.canvas = elem} />;
  }
}

VideoDisplay.propTypes = {
  pipeVideoStreamToCanvas: PropTypes.func.isRequired,
  /* TODO: for documentation
  We might want to use this grayscale function in an example
    processFrame: function (frameData) {
      for (let i = 0; i < frameData.data.length; i += 4) {
        const r = frameData.data[i + 0];
        const g = frameData.data[i + 1];
        const b = frameData.data[i + 2];

        // convert to simple grayscale
        const average = (r + g + b) / 3;
        frameData.data[i + 0] = average;
        frameData.data[i + 1] = average;
        frameData.data[i + 2] = average;
      }
      return frameData;
    }
  */
  processFrame: PropTypes.func,
  displayWidth: PropTypes.number,
  displayHeight: PropTypes.number,
  scaleForDevicePixelRatio: PropTypes.bool
};

VideoDisplay.defaultProps = {
  scaleForDevicePixelRatio: true
};

export default playerContextFilter(VideoDisplay, ['pipeVideoStreamToCanvas']);
