import React, { Component } from 'react';

class PurePropTypesComponent extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    if (this.props) {
      // for props, only shallow compare keys found in propTypes
      for (const propName of Object.keys(this.constructor.propTypes)) {
        if (this.props[propName] !== nextProps[propName]) {
          return true;
        }
      }
    }
    if (this.state) {
      // for state, do normal shallow compare
      for (const key of Object.keys(this.state)) {
        if (!(key in nextState)) {
          return true;
        }
      }
      for (const key of Object.keys(nextState)) {
        if(!(this.state[key] === nextState[key])) {
          return true;
        }
      }
    }
    return false;
  }
}

module.exports = PurePropTypesComponent;
