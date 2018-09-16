import { createContext } from 'react';

const GroupContext = createContext(null);
GroupContext.Provider.displayName = 'GroupContext.Provider';
GroupContext.Consumer.displayName = 'GroupContext.Consumer';

export default GroupContext;
