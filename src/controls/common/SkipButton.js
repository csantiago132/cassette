import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class SkipButton extends Component {
  render () {
    const { back, hidden, onClick } = this.props;
    return (
      <div
        className={classNames('skip_button audio_button', { back, hidden })}
        onClick={onClick}
      >
        <div className="skip_button_inner">
          <div className="right_facing_triangle"></div>
          <div className="right_facing_triangle"></div>
        </div>
      </div>
    );
  }
}

SkipButton.propTypes = {
  back: PropTypes.bool,
  hidden: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

module.exports = SkipButton;
