import React, { PureComponent, PropTypes } from 'react';

class Spacer extends PureComponent {
  render () {
    return <div className="spacer" style={this.props.style} />;
  }
}

Spacer.propTypes = {
  style: React.PropTypes.object
};

module.exports = Spacer;
