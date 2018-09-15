import { createElement } from 'react';
import PropTypes from 'prop-types';

function playerContextFilter (component, contextPropNames) {
  function PlayerContextFilter ({
    playerContext = {},
    fullscreenContext = {},
    ...childProps
  }) {
    for (const propName of contextPropNames) {
      childProps[propName] = playerContext.hasOwnProperty(propName)
        ? playerContext[propName]
        : fullscreenContext[propName];
    }
    return createElement(component, childProps);
  }
  PlayerContextFilter.propTypes = {
    playerContext: PropTypes.object,
    fullscreenContext: PropTypes.object
  };
  const childName = component.displayName || component.name;
  if (childName) {
    PlayerContextFilter.displayName = `PlayerContextFilter(${childName})`;
  }
  return PlayerContextFilter;
}

export default playerContextFilter;
