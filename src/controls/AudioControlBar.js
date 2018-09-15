import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AudioControlBar extends Component {
  render () {
    return (
      <div className="rrap__control_bar" title={this.props.title}>
        {this.props.children}
      </div>
    );
  }
}

AudioControlBar.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default AudioControlBar;
