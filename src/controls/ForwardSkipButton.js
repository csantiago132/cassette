import React, { Component, PropTypes } from 'react';

import SkipButton from './common/SkipButton';

class ForwardSkipButton extends Component {
  render () {
    return <SkipButton onClick={this.props.onForwardSkip} />;
  }
}

ForwardSkipButton.propTypes = {
  onForwardSkip: PropTypes.func.isRequired,
};

module.exports = ForwardSkipButton;
