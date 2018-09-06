import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import SkipButton from './common/SkipButton';
import playerContextFilter from '../factories/playerContextFilter';

class ForwardSkipButton extends PureComponent {
  render () {
    return <SkipButton onClick={this.props.onForwardSkip} />;
  }
}

ForwardSkipButton.propTypes = {
  onForwardSkip: PropTypes.func.isRequired
};

export default playerContextFilter(ForwardSkipButton, ['onForwardSkip']);
