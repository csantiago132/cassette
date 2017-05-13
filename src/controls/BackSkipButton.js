import React, { PureComponent, PropTypes } from 'react';

import SkipButton from './common/SkipButton';

class BackSkipButton extends PureComponent {
  render () {
    return <SkipButton back onClick={this.props.onBackSkip} />;
  }
}

BackSkipButton.propTypes = {
  onBackSkip: PropTypes.func.isRequired,
};

module.exports = BackSkipButton;
