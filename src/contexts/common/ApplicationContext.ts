import { createContext } from "react";
import { StateManager } from "./state-manager";

export interface IApplicationContext {
    /**
     * A manager to manage all realtime state
     */
    stateManager: StateManager;
}

export const ApplicationContext = createContext<IApplicationContext>({
    stateManager: new StateManager(),
});
