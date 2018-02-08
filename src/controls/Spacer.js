import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Spacer extends PureComponent {
  render () {
    return <div className="rrap__spacer" style={this.props.style} />;
  }
}

Spacer.propTypes = {
  style: PropTypes.object
};

export default Spacer;
