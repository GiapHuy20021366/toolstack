import { useEffect, useRef } from "react";
import { ApplicationContext } from "./ApplicationContext";
import {
  ISetValueEventData,
  StateManager,
  stateManagerEvent,
} from "./state-manager";

export interface IApplicationContextProviderProps {
  children?: React.ReactNode;
}

export default function ApplicationContextProvider({
  children,
}: IApplicationContextProviderProps) {
  const stateManagerRef = useRef<StateManager>(new StateManager());

  // Sync the external store with the state manager on mount
  useEffect(() => {
    // Synch
    window.applicationStoreAPI.externals.getAll().then((externals) => {
      Object.entries(externals).forEach(([key, value]) => {
        stateManagerRef.current.setValue(key, value);
      });
    });

    // Add listeners to sync state manager to external store
    const handleExternalChange = (event: ISetValueEventData) => {
      const { key, newValue } = event;
      if (newValue === undefined) {
        // Handle deletion
        window.applicationStoreAPI.externals.delete(key);
      } else {
        // Handle save/update operations
        window.applicationStoreAPI.externals.save(key, newValue);
      }
    };
    stateManagerRef.current.addListener(
      stateManagerEvent.INNER_SET_VALUE_ANY,
      handleExternalChange,
    );

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      stateManagerRef.current.removeListener(
        stateManagerEvent.INNER_SET_VALUE_ANY,
        handleExternalChange,
      );
    };
  }, []);

  return (
    <ApplicationContext.Provider
      value={{
        stateManager: stateManagerRef.current,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}
