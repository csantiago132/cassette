import React from 'react';

// Component: A React Component accepting a subset of playerContext props
// propNames: An array listing names of props to pass
function createControlRenderProp (Component, propNames) {
  return function renderControl (playerContext) {
    return React.createElement(Component, propNames.reduce((props, p) => {
      props[p] = playerContext[p];
      return props;
    }, {}));
  };
}

export default createControlRenderProp;
