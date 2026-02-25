import { createContext } from "react";
import { CTsStateManager } from "../manager/state-manager";

export interface ITsContext {
  /**
   * A manager to manage all realtime state
   */
  stateManager: CTsStateManager;
}

export const TsContext = createContext<ITsContext>({
  stateManager: new CTsStateManager(),
});
