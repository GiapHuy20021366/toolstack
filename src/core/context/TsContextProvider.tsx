import { useRef } from "react";
import { TsContext } from "./TsContext";
import { CTsStateManager } from "../manager/state-manager";

export interface ITsContextProviderProps {
  children?: React.ReactNode;
}

export default function TsContextProvider({
  children,
}: ITsContextProviderProps) {
  const stateManagerRef = useRef<CTsStateManager>(new CTsStateManager());

  return (
    <TsContext.Provider
      value={{
        stateManager: stateManagerRef.current,
      }}
    >
      {children}
    </TsContext.Provider>
  );
}
