import React, { Component } from 'react';
import PropTypes from 'prop-types';

import createControlRenderProp from '../factories/createControlRenderProp';
import * as PlayerPropTypes from '../PlayerPropTypes';

class VideoDisplay extends Component {
  componentDidMount () {
    this.updateStream();
  }

  componentDidUpdate () {
    this.updateStream();
  }

  updateStream () {
    if (this.video.srcObject !== this.props.stream) {
      this.video.srcObject = this.props.stream;
    }
  }

  render () {
    const {
      stream,
      playlist,
      activeTrackIndex,
      crossOrigin,
      ...videoAttributes
    } = this.props;
    return (
      <video
        {...videoAttributes}
        ref={elem => this.video = elem}
        hidden={!stream}
        poster={playlist[activeTrackIndex]
          && playlist[activeTrackIndex].artwork
          && playlist[activeTrackIndex].artwork.length
          && playlist[activeTrackIndex].artwork[0].src}
        crossOrigin={crossOrigin}
        autoPlay
        muted
      />
    );
  }
}

VideoDisplay.propTypes = {
  stream: PropTypes.instanceOf(
    typeof MediaStream === 'undefined' ?
      Object :
      MediaStream
  ),
  playlist: PropTypes.arrayOf(PlayerPropTypes.track.isRequired).isRequired,
  activeTrackIndex: PropTypes.number.isRequired,
  crossOrigin: PropTypes.string
};

export const renderVideoDisplay = createControlRenderProp(VideoDisplay, [
  'stream',
  'playlist',
  'activeTrackIndex',
  'crossOrigin'
]);

export default VideoDisplay;
