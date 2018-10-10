import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { FullscreenButton } from '@cassette/player';
import { VideoDisplay } from '@cassette/components';
import { playerContextFilter } from '@cassette/core';

const miniVideoStyle = {
  width: (50 * 16) / 9
};

class EmbeddedVideoFullscreenButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      miniVideoHover: false
    };
  }

  render() {
    const { fullscreen } = this.props;
    if (fullscreen) {
      // we're showing the video elsewhere when in fullscreen mode
      // so no need to embed the mini video here
      return <FullscreenButton />;
    }
    return (
      <div
        style={{ position: 'relative' }}
        onMouseEnter={() => {
          this.setState({ miniVideoHover: true });
        }}
        onMouseLeave={() => {
          this.setState({ miniVideoHover: false });
        }}
      >
        <VideoDisplay style={miniVideoStyle} imageResolutionY={50} />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            width: miniVideoStyle.width,
            height: 50,
            background: this.state.miniVideoHover
              ? 'rgba(0, 0, 0, 0.3)'
              : undefined
          }}
        >
          <div
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              position: 'absolute'
            }}
          >
            <FullscreenButton />
          </div>
        </div>
      </div>
    );
  }
}

EmbeddedVideoFullscreenButton.propTypes = {
  fullscreen: PropTypes.bool.isRequired
};

export default playerContextFilter(EmbeddedVideoFullscreenButton, [
  'fullscreen'
]);
