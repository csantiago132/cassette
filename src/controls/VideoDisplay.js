import React, { Component } from 'react';
import PropTypes from 'prop-types';

import playerContextFilter from '../factories/playerContextFilter';
import * as PlayerPropTypes from '../PlayerPropTypes';
import { logWarning } from '../utils/console';

class VideoDisplay extends Component {
  componentDidMount () {
    this.checkForBadStuff();
    const { pipeVideoStreamToCanvas, displayWidth, displayHeight } = this.props;
    let warnedAboutNoImageData = false;
    const {
      endStream,
      setCanvasSize
    } = pipeVideoStreamToCanvas(this.canvas, ctx => {
      const { width, height } = this.canvas;
      if (this.props.processFrame && width && height) {
        const frameData = ctx.getImageData(0, 0, width, height);
        const newFrameData = this.props.processFrame(frameData);
        if (!(newFrameData instanceof ImageData)) {
          if (!warnedAboutNoImageData) {
            logWarning(
              'The processFrame function should return an ImageData object. ' +
              'Normally you\'ll just mutate the provided ImageData and ' +
              'return it.'
            );
            warnedAboutNoImageData = true;
          }
        } else {
          ctx.putImageData(newFrameData, 0, 0);
        }
      }
    });
    setCanvasSize(displayWidth, displayHeight);
    this.endStream = endStream;
    this.setCanvasSize = setCanvasSize;
  }

  componentDidUpdate () {
    this.checkForBadStuff();
    this.setCanvasSize(this.props.displayWidth, this.props.displayHeight);
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

  render () {
    const canvasAttributes = { ...this.props };
    delete canvasAttributes.pipeVideoStreamToCanvas;
    delete canvasAttributes.processFrame;
    delete canvasAttributes.displayWidth;
    delete canvasAttributes.displayHeight;
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
  processFrame: PropTypes.func,
  displayWidth: PropTypes.number,
  displayHeight: PropTypes.number
};

export default playerContextFilter(VideoDisplay, ['pipeVideoStreamToCanvas']);
