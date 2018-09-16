import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ButtonWrapper from './common/ButtonWrapper';

class Spacer extends PureComponent {
  render() {
    return (
      <ButtonWrapper>
        <div className="rrap__spacer" />
      </ButtonWrapper>
    );
  }
}

Spacer.propTypes = {
  style: PropTypes.object
};

export const renderSpacer = () => <Spacer />;

export default Spacer;
