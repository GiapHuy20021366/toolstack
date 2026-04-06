import { IdentifyStateHandler } from "./identify-state-handler";
import { GlobalStateHandler } from "./global-state-handler";
import { StateManager } from "../../common/state-manager";
import { ExternalStateHandler } from "./external-state-handler";
import { FunctionStateHandler } from "./function-state-handler";

export enum EEditorStateManagerTag {
  GRAPHIC = "@graphic",
  STATE = "@state",
  WORKSPACE = "@workspace",
  REFS = "@refs",
  EXTERNAL = "@external",
}

export const editorStateManagerEvent = {
  SET_GRAPHIC_NAME: "@graphic/name",
} as const;

export const makeEditorStateManagerKey = (...params: string[]) => {
  return params.join(".");
};

export const makeEditorGraphicKey = (cid: string, dataKey: string) => {
  return makeEditorStateManagerKey(
    EEditorStateManagerTag.GRAPHIC,
    cid,
    dataKey,
  );
};

export const makeEditorGlobalKey = (stateName: string) => {
  return makeEditorStateManagerKey(
    EEditorStateManagerTag.STATE,
    "global",
    stateName,
    "value",
  );
};

export const makeEditorGraphicStateKey = (cid: string, stateName: string) => {
  return makeEditorStateManagerKey(
    EEditorStateManagerTag.STATE,
    cid,
    stateName,
    "value",
  );
};

export const makeEditorGraphicStateInKey = (cid: string, stateName: string) => {
  return makeEditorStateManagerKey(
    EEditorStateManagerTag.STATE,
    cid,
    stateName,
    "in",
  );
};

export const makeEditorGraphicStateOutKey = (
  cid: string,
  stateName: string,
) => {
  return makeEditorStateManagerKey(
    EEditorStateManagerTag.STATE,
    cid,
    stateName,
    "out",
  );
};

export const makeEditorWorkspaceKey = (dataKey: string) => {
  return makeEditorStateManagerKey(
    EEditorStateManagerTag.WORKSPACE,
    "workspace",
    dataKey,
  );
};

export const makeEditorRefKey = (cid: string) => {
  return makeEditorStateManagerKey(EEditorStateManagerTag.REFS, cid);
};
export const makeEditorExternalKey = (cid: string) => {
  return makeEditorStateManagerKey(EEditorStateManagerTag.EXTERNAL, cid);
};

export class EditorStateManager extends StateManager {
  private _parent: StateManager | null;

  private _externalStateHandler: ExternalStateHandler;
  private _globalStateHandler: GlobalStateHandler;
  private _identifyStateHandler: IdentifyStateHandler;
  private _functionStateHandler: FunctionStateHandler;

  constructor() {
    super();
    this._parent = null;
    this._globalStateHandler = new GlobalStateHandler(this);
    this._identifyStateHandler = new IdentifyStateHandler(this);
    this._externalStateHandler = new ExternalStateHandler(this);
    this._functionStateHandler = new FunctionStateHandler(this);
  }

  syncWithParent(parent: StateManager) {
    for (const [key, value] of parent.keyValueMap.entries()) {
      const externalKeyPrefix = makeEditorExternalKey(key);
      this.setValue(externalKeyPrefix, value, { silent: true });
    }
  }

  reset() {
    this._globalStateHandler.reset();
    this._identifyStateHandler.reset();
    this._externalStateHandler.reset();
    this.keyValueMap = new Map();
  }

  getStateDictionaryByPrefix(prefix: string, extractName = true) {
    const rs: Record<string, unknown> = {};
    for (const [key, val] of this.keyValueMap.entries()) {
      if (key.startsWith(prefix)) {
        const tKey = extractName ? key.slice(prefix.length) : key;
        rs[tKey] = val;
      }
    }
    return rs;
  }

  getStateDictionaryBySelector(
    selector: (key: string) => boolean,
    extractor?: (key: string) => string,
  ) {
    const rs: Record<string, unknown> = {};
    for (const [key, val] of this.keyValueMap.entries()) {
      if (selector(key)) {
        const tKey = extractor ? extractor(key) : key;
        rs[tKey] = val;
      }
    }
    return rs;
  }

  get identifyStateHandler() {
    return this._identifyStateHandler;
  }

  get functionStateHandler() {
    return this._functionStateHandler;
  }

  get parent() {
    return this._parent;
  }

  set parent(manager: StateManager | null) {
    this._parent = manager;
    if (manager) {
      this.syncWithParent(manager);
    }
  }
}
