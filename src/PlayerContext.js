import createContext from 'create-react-15-context';

const PlayerContext = createContext(null);
PlayerContext.Provider.displayName = 'PlayerContext.Provider';
PlayerContext.Consumer.displayName = 'PlayerContext.Consumer';

export default PlayerContext;
