import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';

import { playerContextFilter, PlayerPropTypes } from '@cassette/core';
import { logWarning } from '@cassette/core/_undocumented';

/* Here is an explanation of the 4 different types of "height"/"width"
 * referenced in this file:
 *   1. imageResolutionX / imageResolutionY
 *     - These are optional props for determining which resolution
 *       we use to display the video. They are assigned to canvas.width
 *       and canvas.height. If one or both are left out, then we use the
 *       video's regular dimensions to figure it out.
 *       We optionally multiply these by the devicePixelRatio to support
 *       hi-DPI (e.g. Retina) displays.
 *   2. realDisplayWidth / realDisplayHeight
 *     - These reflect whatever canvas.width and canvas.height are.
 *       This is different than imageResolutionX / imageResolutionY since
 *       they are actual values and can't be null.
 *   3. containerWidth / containerHeight
 *     - These reflect the actual client offsetWidth and offsetHeight
 *       of the div container around the canvas, in CSS pixels.
 *   4. canvas.style.width / canvas.style.height
 *     - These values are used to scale the canvas's onscreen area.
 *       They form the same ratio as realDisplayWidth / realDisplayHeight
 *       but are adjusted so the canvas maximally fills the container area.
 */

// 'x:y' -> x / y
function extractAspectRatio(aspectRatio) {
  const values = aspectRatio.split(':').map(Number);
  return values[0] / values[1];
}

const defaultBgColor = '#000';

export class VideoDisplay extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // realDisplayWidth, realDisplayHeight are in canvas display units
      realDisplayWidth: 0,
      realDisplayHeight: 0,
      // containerWidth, containerHeight are in CSS pixel units
      containerWidth: 0,
      containerHeight: 0
    };
  }

  componentDidMount() {
    // set initial canvas size to 0 to avoid weird layout glitches with
    // the default canvas size (300x150 px in Chrome)
    this.canvas.width = 0;
    this.canvas.height = 0;

    this.checkForBadStuff();
    const {
      imageResolutionX,
      imageResolutionY
    } = this.getDeviceDisplayDimensions();
    const {
      endStream,
      setCanvasSize,
      setPlaceholderImage
    } = this.props.pipeVideoStreamToCanvas(
      this.canvas,
      this.handleFrameUpdate.bind(this)
    );
    setCanvasSize(imageResolutionX, imageResolutionY);
    this.getPlaceholderImage(setPlaceholderImage);
    this.endStream = endStream;
    this.setCanvasSize = setCanvasSize;
    this.setPlaceholderImage = setPlaceholderImage;
    this.updateContainerDimensions();

    this.containerResizeObserver = new ResizeObserver(
      this.updateContainerDimensions.bind(this)
    );
    this.containerResizeObserver.observe(this.containerElement);
  }

  componentDidUpdate() {
    this.checkForBadStuff();
    const {
      imageResolutionX,
      imageResolutionY
    } = this.getDeviceDisplayDimensions();
    this.setCanvasSize(imageResolutionX, imageResolutionY);
    this.getPlaceholderImage(this.setPlaceholderImage);
  }

  componentWillUnmount() {
    this.endStream();
    this.containerResizeObserver.disconnect();
  }

  checkForBadStuff() {
    if (
      !this.warnedAboutBadStuff &&
      this.props.processFrame &&
      !this.props.imageResolutionX &&
      !this.props.imageResolutionY
    ) {
      logWarning(
        'VideoDisplay: Supplying a processFrame function without also ' +
          'giving a imageResolutionX or imageResolutionY means the video ' +
          'will be processed at the full resolution. This may lead to a poor ' +
          'framerate.'
      );
      this.warnedAboutBadStuff = true;
    }
  }

  updateContainerDimensions() {
    const { offsetWidth, offsetHeight } = this.containerElement;
    this.setState(state => {
      if (
        offsetWidth === state.containerWidth &&
        offsetHeight === state.containerHeight
      ) {
        return null;
      }
      return {
        containerWidth: offsetWidth,
        containerHeight: offsetHeight
      };
    });
  }

  getDeviceDisplayDimensions() {
    const {
      imageResolutionX,
      imageResolutionY,
      scaleForDevicePixelRatio
    } = this.props;
    const scale = (scaleForDevicePixelRatio && window.devicePixelRatio) || 1;
    return {
      imageResolutionX: imageResolutionX && scale * imageResolutionX,
      imageResolutionY: imageResolutionY && scale * imageResolutionY
    };
  }

  getPlaceholderImage(callback) {
    const {
      playlist,
      activeTrackIndex,
      getPlaceholderImageForTrack
    } = this.props;
    const track = playlist[activeTrackIndex];
    const img = getPlaceholderImageForTrack(track || null);
    if (!img) {
      callback();
    } else if (img.naturalWidth && img.naturalHeight) {
      callback(img);
    } else {
      img.addEventListener('load', () => callback(img));
      img.addEventListener('error', () => callback());
    }
  }

  handleFrameUpdate(canvasContext, isVideo) {
    const { width, height } = this.canvas;
    if (width && height) {
      this.setState(state => {
        if (
          width === state.realDisplayWidth &&
          height === state.realDisplayHeight
        ) {
          return null;
        }
        return {
          realDisplayWidth: width,
          realDisplayHeight: height
        };
      });
    }
    if (!(this.props.processFrame && width && height)) {
      return;
    }
    if (!isVideo && !this.props.shouldProcessPlaceholderImages) {
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
          "Normally you'll just mutate the provided ImageData and " +
          'return it.'
      );
      this.warnedAboutNoImageData = true;
    }
  }

  render() {
    const {
      aspectRatio,
      fullscreen,
      maintainAspectRatioInFullscreen,
      ...attributes
    } = this.props;
    delete attributes.pipeVideoStreamToCanvas;
    delete attributes.processFrame;
    delete attributes.imageResolutionX;
    delete attributes.imageResolutionY;
    delete attributes.scaleForDevicePixelRatio;
    delete attributes.playlist;
    delete attributes.activeTrackIndex;
    delete attributes.getPlaceholderImageForTrack;
    delete attributes.shouldProcessPlaceholderImages;

    const {
      realDisplayWidth,
      realDisplayHeight,
      containerWidth,
      containerHeight
    } = this.state;

    const canvasStyle = {};
    if (
      realDisplayWidth &&
      realDisplayHeight &&
      containerWidth &&
      containerHeight
    ) {
      const realDisplayRatio = realDisplayWidth / realDisplayHeight;
      const containerRatio = containerWidth / containerHeight;
      if (realDisplayRatio === containerRatio) {
        canvasStyle.width = containerWidth;
        canvasStyle.height = containerHeight;
      } else if (realDisplayRatio > containerRatio) {
        // video is wider than container - scale with bars on top and bottom
        canvasStyle.width = containerWidth;
        canvasStyle.height = containerWidth / realDisplayRatio;
      } else {
        // video is taller than container - scale with bars on left and right
        canvasStyle.height = containerHeight;
        canvasStyle.width = containerHeight * realDisplayRatio;
      }
    }

    const containerStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: defaultBgColor,
      ...(attributes.style || {})
    };
    if (
      aspectRatio &&
      containerWidth &&
      (!fullscreen || maintainAspectRatioInFullscreen)
    ) {
      if (containerStyle.height && !this.warnedAboutStyleOverride) {
        logWarning(
          'VideoDisplay cannot style.height prop which is ' +
            'overridden by aspectRatio.'
        );
        this.warnedAboutStyleOverride = true;
      }
      // h = w/(x/y)  -->  h*(x/y) = w  -->  x/y = w/h
      containerStyle.height = containerWidth / extractAspectRatio(aspectRatio);
    }

    return (
      <div
        {...attributes}
        style={containerStyle}
        ref={elem => (this.containerElement = elem)}
      >
        <canvas style={canvasStyle} ref={elem => (this.canvas = elem)} />
      </div>
    );
  }
}

VideoDisplay.propTypes = {
  pipeVideoStreamToCanvas: PropTypes.func.isRequired,
  playlist: PropTypes.arrayOf(PlayerPropTypes.track.isRequired).isRequired,
  activeTrackIndex: PropTypes.number.isRequired,
  fullscreen: PropTypes.bool,
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
  imageResolutionX: PropTypes.number,
  imageResolutionY: PropTypes.number,
  scaleForDevicePixelRatio: PropTypes.bool.isRequired,
  aspectRatio: PlayerPropTypes.aspectRatio,
  getPlaceholderImageForTrack: PropTypes.func.isRequired,
  shouldProcessPlaceholderImages: PropTypes.bool.isRequired,
  maintainAspectRatioInFullscreen: PropTypes.bool.isRequired
};

VideoDisplay.defaultProps = {
  scaleForDevicePixelRatio: true,
  aspectRatio: '16:9',
  getPlaceholderImageForTrack(track) {
    if (track && track.artwork) {
      const img = new Image();
      img.src = track.artwork[0].src;
      return img;
    }
  },
  shouldProcessPlaceholderImages: false,
  maintainAspectRatioInFullscreen: false
};

export default playerContextFilter(VideoDisplay, [
  'pipeVideoStreamToCanvas',
  'playlist',
  'activeTrackIndex',
  'fullscreen'
]);
