import { createContext } from "react";
import { EditorStateManager } from "./state/editor-state-manager";

export interface GraphicEditorStateContextContext {
  /**
   * A manager to manage all realtime state
   */
  stateManager: EditorStateManager;
}

export const GraphicEditorStateContext = createContext<GraphicEditorStateContextContext>({
  stateManager: new EditorStateManager(),
});
