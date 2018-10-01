import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { playerContextFilter } from 'media-player-core';

import SkipButton from './common/SkipButton';

export class ForwardSkipButton extends PureComponent {
  render() {
    return <SkipButton onClick={this.props.onForwardSkip} />;
  }
}

ForwardSkipButton.propTypes = {
  onForwardSkip: PropTypes.func.isRequired
};

export default playerContextFilter(ForwardSkipButton, ['onForwardSkip']);
