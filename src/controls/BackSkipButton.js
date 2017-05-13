import React, { Component, PropTypes } from 'react';

import SkipButton from './common/SkipButton';

class BackSkipButton extends Component {
  render () {
    return <SkipButton back onClick={this.props.onBackSkip} />;
  }
}

BackSkipButton.propTypes = {
  onBackSkip: PropTypes.func.isRequired,
};

module.exports = BackSkipButton;
