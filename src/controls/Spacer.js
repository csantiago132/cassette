import React, { PropTypes } from 'react';

import PurePropTypesComponent from './common/PurePropTypesComponent';

class Spacer extends PurePropTypesComponent {
  render () {
    return <div className="spacer" style={this.props.style} />;
  }
}

Spacer.propTypes = {
  style: React.PropTypes.object
};

module.exports = Spacer;
