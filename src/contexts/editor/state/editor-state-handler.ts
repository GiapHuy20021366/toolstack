import { EditorStateManager } from "./editor-state-manager";

export abstract class EditorStateHandler {
    private _parent: EditorStateManager;

    constructor(parent: EditorStateManager) {
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