import createContext from 'create-react-context';

import { logWarning } from './utils/console';

const FullscreenContext = createContext({
  fullscreen: false,
  requestFullscreen () {
    logWarning(
      'Fullscreen request ignored since there is no ' +
      'FullscreenContextProvider ancestor.'
    );
  },
  requestExitFullscreen () {
    logWarning(
      'Exit fullscreen request ignored since there is no ' +
      'FullscreenContextProvider ancestor.'
    );
  }
});
FullscreenContext.Provider.displayName = 'FullscreenContext.Provider';
FullscreenContext.Consumer.displayName = 'FullscreenContext.Consumer';

export default FullscreenContext;
