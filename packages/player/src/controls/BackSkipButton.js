import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { playerContextFilter } from '@cassette/core';

import SkipButton from './common/SkipButton';

export class BackSkipButton extends PureComponent {
  render() {
    return <SkipButton back onClick={this.props.onBackSkip} />;
  }
}

BackSkipButton.propTypes = {
  onBackSkip: PropTypes.func.isRequired
};

export default playerContextFilter(BackSkipButton, ['onBackSkip']);
