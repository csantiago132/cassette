import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ShuffleIcon from 'svg-react-loader?name=ShuffleIcon!material-design-icons/av/svg/design/ic_shuffle_48px.svg';

import PurePropTypesComponent from './common/PurePropTypesComponent';

class ShuffleButton extends PurePropTypesComponent {
  render () {
    const { shuffle, onToggleShuffle } = this.props;
    return (
      <div
        className={classNames(
          'rrap__repeat_button rrap__audio_button',
          { repeat: shuffle }
        )}
        onClick={onToggleShuffle}
      >
        <div className="inner">
          <ShuffleIcon className="foreground" width="100%" height="100%" />
        </div>
      </div>
    );
  }
}

ShuffleButton.propTypes = {
  shuffle: PropTypes.bool.isRequired,
  onToggleShuffle: PropTypes.func.isRequired
};

module.exports = ShuffleButton;
