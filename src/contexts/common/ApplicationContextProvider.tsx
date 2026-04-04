import { useRef } from "react";
import { ApplicationContext } from "./ApplicationContext";
import { StateManager } from "./state-manager";

export interface IApplicationContextProviderProps {
  children?: React.ReactNode;
}

export default function ApplicationContextProvider({
  children,
}: IApplicationContextProviderProps) {
  const stateManagerRef = useRef<StateManager>(new StateManager());

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
