import { IdentifyStateHandler } from './identify-state-handler';
import { GlobalStateHandler } from "./global-state-handler";
import {
  CTsVariableManager,
} from "./variable-manager";

export enum EStateManagerTag {
  GRAPHIC = "@graphic",
  STATE = "@state",
  WORKSPACE = "@workspace",
}

export const makeStateManagerKey = (...params: string[]) => {
  return params.join(".");
};

export const makeGraphicKey = (cid: string, dataKey: string) => {
  return makeStateManagerKey(EStateManagerTag.GRAPHIC, cid, dataKey);
};

export const makeGlobalKey = (stateName: string) => {
  return makeStateManagerKey(
    EStateManagerTag.STATE,
    "global",
    stateName,
    "value",
  );
};

export const makeGraphicStateKey = (cid: string, stateName: string) => {
  return makeStateManagerKey(EStateManagerTag.STATE, cid, stateName, "value");
};

export const makeGraphicStateInKey = (cid: string, stateName: string) => {
  return makeStateManagerKey(EStateManagerTag.STATE, cid, stateName, "in");
};

export const makeGraphicStateOutKey = (cid: string, stateName: string) => {
  return makeStateManagerKey(EStateManagerTag.STATE, cid, stateName, "out");
};

export const makeWorkspaceKey = (dataKey: string) => {
  return makeStateManagerKey(EStateManagerTag.WORKSPACE, "workspace", dataKey);
};

export interface ICTsStateManagerSerializeData {
  stateInKeyMap: Record<string, string[]>;
  stateOutKeyMap: Record<string, string>;
  keyValueMap: Record<string, unknown>;
}
export interface ICTsStateManagerSerializeOptions {
  includes?: {
    stateInKeyMap?: boolean;
    stateOutKeyMap?: boolean;
    keyValueMap?: boolean;
  };
}

export class CTsStateManager extends CTsVariableManager {
  private _globalStateHandler: GlobalStateHandler;
  private _identifyStateHandler: IdentifyStateHandler;

  constructor() {
    super();
    this._globalStateHandler = new GlobalStateHandler(this);
    this._identifyStateHandler = new IdentifyStateHandler(this);
  }

  serialize(
    options?: ICTsStateManagerSerializeOptions,
  ): ICTsStateManagerSerializeData {
    const result: ICTsStateManagerSerializeData = {
      keyValueMap: {},
      stateInKeyMap: {},
      stateOutKeyMap: {},
    };

    if (options?.includes?.keyValueMap !== false) {
      result.keyValueMap = Object.fromEntries(
        Array.from(this.keyValueMap.entries()).map(([key, value]) => [
          key,
          value,
        ]),
      );
    }

    if (options?.includes?.stateInKeyMap !== false) {
      result.stateInKeyMap = Object.fromEntries(
        Array.from(this._globalStateHandler.stateInKeyMap.entries()).map(([key, set]) => [
          key,
          Array.from(set),
        ]),
      );
    }

    if (options?.includes?.stateOutKeyMap !== false) {
      result.stateOutKeyMap = Object.fromEntries(
        Array.from(this._globalStateHandler.stateOutKeyMap.entries()).map(([key, val]) => [
          key,
          val,
        ]),
      );
    }

    return result;
  }

  deserialize(data: ICTsStateManagerSerializeData): CTsStateManager {
    this.keyValueMap = new Map();
    const newStateInKeyMap = new Map();
    const newStateOutKeyMap = new Map();

    this._globalStateHandler.stateInKeyMap = newStateInKeyMap;
    this._globalStateHandler.stateOutKeyMap = newStateOutKeyMap;

    for (const [key, val] of Object.entries(data.keyValueMap)) {
      this.setValue(key, val, { silent: true });
    }

    for (const [key, set] of Object.entries(data.stateInKeyMap)) {
      newStateInKeyMap.set(key, new Set(set));
    }

    for (const [key, val] of Object.entries(data.stateOutKeyMap)) {
      newStateOutKeyMap.set(key, val);
    }

    return this;
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
}
