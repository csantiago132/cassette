import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import SkipButton from './common/SkipButton';
import createControlRenderProp from '../factories/createControlRenderProp';

class ForwardSkipButton extends PureComponent {
  render () {
    return <SkipButton onClick={this.props.onForwardSkip} />;
  }
}

ForwardSkipButton.propTypes = {
  onForwardSkip: PropTypes.func.isRequired
};

export const renderForwardSkipButton = createControlRenderProp(ForwardSkipButton, [
  'onForwardSkip'
]);

export default ForwardSkipButton;
