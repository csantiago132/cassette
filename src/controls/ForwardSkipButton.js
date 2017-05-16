import React, { PropTypes } from 'react';

import PurePropTypesComponent from './common/PurePropTypesComponent';
import SkipButton from './common/SkipButton';

class ForwardSkipButton extends PurePropTypesComponent {
  render () {
    return <SkipButton onClick={this.props.onForwardSkip} />;
  }
}

ForwardSkipButton.propTypes = {
  onForwardSkip: PropTypes.func.isRequired,
};

module.exports = ForwardSkipButton;
