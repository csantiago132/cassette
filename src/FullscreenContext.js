import createContext from 'create-react-context';

const FullscreenContext = createContext({
  fullscreen: false,
  requestFullscreen () {}
});
FullscreenContext.Provider.displayName = 'FullscreenContext.Provider';
FullscreenContext.Consumer.displayName = 'FullscreenContext.Consumer';

export default FullscreenContext;
