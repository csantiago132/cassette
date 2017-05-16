import React, { PropTypes } from 'react';

import PurePropTypesComponent from './common/PurePropTypesComponent';
import SkipButton from './common/SkipButton';

class BackSkipButton extends PurePropTypesComponent {
  render () {
    return <SkipButton back onClick={this.props.onBackSkip} />;
  }
}

BackSkipButton.propTypes = {
  onBackSkip: PropTypes.func.isRequired,
};

module.exports = BackSkipButton;
