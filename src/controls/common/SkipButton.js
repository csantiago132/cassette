import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ButtonWrapper from './ButtonWrapper';

class SkipButton extends PureComponent {
  render() {
    const { back, onClick } = this.props;
    return (
      <ButtonWrapper>
        <button
          className={classNames('rrap__skip_button rrap__audio_button', {
            back
          })}
          onClick={onClick}
        >
          <div className="skip_button_inner foreground">
            <div className="right_facing_triangle" />
            <div className="right_facing_triangle" />
            <div className="vertical_bar" />
          </div>
        </button>
      </ButtonWrapper>
    );
  }
}

SkipButton.propTypes = {
  back: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

export default SkipButton;
