import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import PurePropTypesComponent from './PurePropTypesComponent';

class SkipButton extends PurePropTypesComponent {
  render () {
    const { back, onClick } = this.props;
    return (
      <button
        className={classNames(
          'rrap__skip_button rrap__audio_button',
          { back }
        )}
        onClick={onClick}
      >
        <div className="skip_button_inner foreground">
          <div className="right_facing_triangle"></div>
          <div className="right_facing_triangle"></div>
          <div className="vertical_bar"></div>
        </div>
      </button>
    );
  }
}

SkipButton.propTypes = {
  back: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default SkipButton;
