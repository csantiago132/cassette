import React, { Component, PropTypes } from 'react';

import SkipButton from './common/SkipButton';

class BackSkipButton extends Component {
  render () {
    const { hidden, onBackSkip } = this.props;
    return <SkipButton hidden={hidden} onClick={onBackSkip} back />;
  }
}

BackSkipButton.propTypes = {
  hidden: PropTypes.bool.isRequired,
  onBackSkip: PropTypes.func.isRequired,
};

module.exports = BackSkipButton;
