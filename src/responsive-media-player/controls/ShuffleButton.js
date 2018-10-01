import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ShuffleIcon from '@benwiley4000/svg-react-loader?name=ShuffleIcon!material-design-icons/av/svg/design/ic_shuffle_48px.svg?';

import { playerContextFilter } from 'media-player-core';

import ButtonWrapper from './common/ButtonWrapper';
import classNames from '../utils/classNames';

class ShuffleButton extends PureComponent {
  render() {
    const { shuffle, onToggleShuffle } = this.props;
    return (
      <ButtonWrapper>
        <button
          type="button"
          className={classNames(
            'rrap__material_toggle rrap__audio_button rrap__shuffle_btn',
            { on: shuffle }
          )}
          onClick={onToggleShuffle}
        >
          <div className="inner foreground">
            <ShuffleIcon width="100%" height="100%" />
          </div>
        </button>
      </ButtonWrapper>
    );
  }
}

ShuffleButton.propTypes = {
  shuffle: PropTypes.bool.isRequired,
  onToggleShuffle: PropTypes.func.isRequired
};

export default playerContextFilter(ShuffleButton, [
  'shuffle',
  'onToggleShuffle'
]);
