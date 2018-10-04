import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FullscreenIcon from '@benwiley4000/svg-react-loader?name=FullscreenIcon!material-design-icons/navigation/svg/design/ic_fullscreen_48px.svg?';
import FullscreenExitIcon from '@benwiley4000/svg-react-loader?name=FullscreenExitIcon!material-design-icons/navigation/svg/design/ic_fullscreen_exit_48px.svg?';

import { playerContextFilter } from '@cassette/core';

import ButtonWrapper from './common/ButtonWrapper';
import classNames from '../utils/classNames';

export class FullscreenButton extends PureComponent {
  render() {
    const { fullscreen, requestFullscreen, requestExitFullscreen } = this.props;
    const IconComponent = fullscreen ? FullscreenExitIcon : FullscreenIcon;
    return (
      <ButtonWrapper>
        <button
          type="button"
          className={classNames(
            'cassette__material_toggle cassette__media_button cassette__fullscreen_btn',
            { on: fullscreen }
          )}
          onClick={fullscreen ? requestExitFullscreen : requestFullscreen}
        >
          <div className="inner foreground">
            <IconComponent width="100%" height="100%" />
          </div>
        </button>
      </ButtonWrapper>
    );
  }
}

FullscreenButton.propTypes = {
  fullscreen: PropTypes.bool.isRequired,
  requestFullscreen: PropTypes.func.isRequired,
  requestExitFullscreen: PropTypes.func.isRequired
};

export default playerContextFilter(FullscreenButton, [
  'fullscreen',
  'requestFullscreen',
  'requestExitFullscreen'
]);
