import React, { PureComponent } from 'react';

import ButtonWrapper from './common/ButtonWrapper';

export class Spacer extends PureComponent {
  render() {
    return (
      <ButtonWrapper>
        <div className="rrap__spacer" />
      </ButtonWrapper>
    );
  }
}

export default Spacer;
