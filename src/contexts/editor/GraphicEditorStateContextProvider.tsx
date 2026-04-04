import { useRef } from "react";
import { EditorStateManager } from "./state/editor-state-manager";
import { GraphicEditorStateContext } from "./GraphicEditorStateContext";

export interface ITsContextProviderProps {
  children?: React.ReactNode;
}

export default function GraphicEditorStateContextProvider({
  children,
}: ITsContextProviderProps) {
  const stateManagerRef = useRef<EditorStateManager>(new EditorStateManager());

  return (
    <GraphicEditorStateContext.Provider
      value={{
        stateManager: stateManagerRef.current,
      }}
    >
      {children}
    </GraphicEditorStateContext.Provider>
  );
}
