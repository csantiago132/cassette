Although not required, `PlayerContextGroup` can accept any of the props for `PlayerContextProvider`, which will be passed as defaults to any descendant `PlayerContextProvider` instances.

Additionally, for advanced use cases, `PlayerContextGroup` instances can be nested inside one another. If a prop is passed to a descendant `PlayerContextGroup`, it will override the default value from the ancestor.
