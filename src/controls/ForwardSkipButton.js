import React, { Component, PropTypes } from 'react';

import SkipButton from './common/SkipButton';

class ForwardSkipButton extends Component {
  render () {
    const { hidden, onForwardSkip } = this.props;
    return <SkipButton hidden={hidden} onClick={onForwardSkip} />;
  }
}

ForwardSkipButton.propTypes = {
  hidden: PropTypes.bool.isRequired,
  onForwardSkip: PropTypes.func.isRequired,
};

module.exports = ForwardSkipButton;
