import React, { Component } from 'react';
import PropTypes from 'prop-types';

import GroupContext from './GroupContext';

class PlayerContextGroup extends Component {
  render () {
    return (
      <GroupContext.Provider value={this.props}>
        {this.props.children}
      </GroupContext.Provider>
    );
  }
}

PlayerContextGroup.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PlayerContextGroup;
