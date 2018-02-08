import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import SkipButton from './common/SkipButton';
import createControlRenderProp from '../factories/createControlRenderProp';

class BackSkipButton extends PureComponent {
  render () {
    return <SkipButton back onClick={this.props.onBackSkip} />;
  }
}

BackSkipButton.propTypes = {
  onBackSkip: PropTypes.func.isRequired
};

export const renderBackSkipButton = createControlRenderProp(BackSkipButton, [
  'onBackSkip'
]);

export default BackSkipButton;
