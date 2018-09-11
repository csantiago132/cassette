import createContext from 'create-react-context';

const GroupContext = createContext({});
GroupContext.Provider.displayName = 'GroupContext.Provider';
GroupContext.Consumer.displayName = 'GroupContext.Consumer';

export default GroupContext;
