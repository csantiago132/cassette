import { createContext } from 'react';

const _global = typeof window === 'undefined' ? global : window;
_global.__player_context_created__ = _global.__player_context_created__ || {};

function createSingleGlobalContext(displayName, defaultValue = null) {
  if (_global.__player_context_created__[displayName]) {
    return _global.__player_context_created__[displayName];
  }
  const Context = createContext(defaultValue);
  Context.displayName = displayName;
  _global.__player_context_created__[displayName] = Context;
  return Context;
}

export default createSingleGlobalContext;
