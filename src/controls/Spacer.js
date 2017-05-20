import React from 'react';
import PropTypes from 'prop-types';

import PurePropTypesComponent from './common/PurePropTypesComponent';

class Spacer extends PurePropTypesComponent {
  render () {
    return <div className="spacer" style={this.props.style} />;
  }
}

Spacer.propTypes = {
  style: PropTypes.object
};

module.exports = Spacer;
