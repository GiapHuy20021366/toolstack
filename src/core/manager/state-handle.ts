import { CTsStateManager } from "./state-manager";

export abstract class StateHandler {
    private _parent: CTsStateManager;

    constructor(parent: CTsStateManager) {
        this._parent = parent;
        this.init();
    }

    get parent() {
        return this._parent;
    }

    /**
     * Reset the handle data
     */
    public abstract reset(): void;
    /**
     * Load the handle data
     */
    public abstract load(): void;
    /**
     * Init the handle
     */
    protected abstract init(): void;
}