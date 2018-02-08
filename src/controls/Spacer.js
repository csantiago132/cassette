import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Spacer extends PureComponent {
  render () {
    return <div className="rrap__spacer" />;
  }
}

Spacer.propTypes = {
  style: PropTypes.object
};

export const renderSpacer = () => <Spacer />;

export default Spacer;
