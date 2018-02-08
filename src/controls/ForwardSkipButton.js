import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import SkipButton from './common/SkipButton';

class ForwardSkipButton extends PureComponent {
  render () {
    return <SkipButton onClick={this.props.onForwardSkip} />;
  }
}

ForwardSkipButton.propTypes = {
  onForwardSkip: PropTypes.func.isRequired
};

export default ForwardSkipButton;
