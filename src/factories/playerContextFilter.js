import { createElement } from 'react';
import PropTypes from 'prop-types';

function playerContextFilter (component, contextPropNames) {
  function PlayerContextFilter ({ playerContext, ...childProps }) {
    for (const propName of contextPropNames) {
      childProps[propName] = playerContext[propName];
    }
    return createElement(component, childProps);
  }
  PlayerContextFilter.propTypes = {
    playerContext: PropTypes.object.isRequired
  };
  const childName = component.displayName || component.name;
  if (childName) {
    PlayerContextFilter.displayName = `PlayerContextFilter(${childName})`;
  }
  return PlayerContextFilter;
}

export default playerContextFilter;
