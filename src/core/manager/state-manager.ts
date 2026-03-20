import {
  CTsVariableManager,
  ISetValueEventData,
  TsVariableManagerEvent,
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
  // Mapping between global state -> all local states
  private stateInKeyMap: Map<string, Set<string>> = new Map();
  // Mapping between local state ->  global states
  private stateOutKeyMap: Map<string, string> = new Map();
  constructor() {
    super();

    // Handle state value, state in, state out reflection
    this.addListener(
      TsVariableManagerEvent.SET_VALUE_ANY,
      (data: ISetValueEventData) => {
        const { key, oldValue, newValue } = data as ISetValueEventData<string>;
        const [tag, id] = key.split(".");
        if (tag === EStateManagerTag.STATE) {
          // Global state handle
          if (id === "global") {
            // Reflect value out
            const outKey = this.stateOutKeyMap.get(key);
            if (outKey) {
              this.setValue(outKey, newValue);
            }

            // Reflect value in
            const inSet = this.stateInKeyMap.get(key);
            if (inSet) {
              for (const inKey of inSet) {
                this.setValue(inKey, newValue);
              }
            }
          }

          // Graphic state change handle
          if (key.endsWith(".value")) {
            // Reflect value out
            const outKey = this.stateOutKeyMap.get(key);
            if (outKey) {
              this.setValue(outKey, newValue);
            }

            // Reflect value in
            const inSet = this.stateInKeyMap.get(key);
            if (inSet) {
              for (const inKey of inSet) {
                this.setValue(inKey, newValue);
              }
            }
            return;
          }

          // Graphic state in change handle
          if (key.endsWith(".in")) {
            const [_tag, cid, stateName, _inText] = key.split(".");
            const componentStateKey = makeGraphicStateKey(cid, stateName);
            // Remove in old set
            if (oldValue) {
              // remove in old set
              const oldGlobalStateKey = makeGlobalKey(oldValue);
              const set = this.stateInKeyMap.get(oldGlobalStateKey);
              if (set != null) {
                set.delete(componentStateKey);
                if (set.size == 0) {
                  this.stateInKeyMap.delete(oldGlobalStateKey);
                }
              }
            }
            // Add in new set
            const globalKey = makeGlobalKey(newValue);
            if (newValue) {
              const set = this.stateInKeyMap.get(globalKey) ?? new Set();
              set.add(componentStateKey);
              this.stateInKeyMap.set(globalKey, set);
            }
            // Reflect value
            const reflectValue = this.getValue(globalKey);
            if (reflectValue !== undefined) {
              this.setValue(componentStateKey, this.getValue(globalKey));
            }
            return;
          }

          // Graphic state out change handle
          if (key.endsWith(".out")) {
            if (newValue) {
              const [, cid, stateName] = key.split(".");
              const componentStateKey = makeGraphicStateKey(cid, stateName);
              const globalKey = makeGlobalKey(newValue);
              this.stateOutKeyMap.set(componentStateKey, globalKey);
              // Reflect value
              const reflectValue = this.getValue(componentStateKey);
              if (reflectValue !== undefined) {
                this.setValue(globalKey, this.getValue(componentStateKey));
              }
            }
            return;
          }
        }
      },
    );
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
        Array.from(this.stateInKeyMap.entries()).map(([key, set]) => [
          key,
          Array.from(set),
        ]),
      );
    }

    if (options?.includes?.stateOutKeyMap !== false) {
      result.stateOutKeyMap = Object.fromEntries(
        Array.from(this.stateOutKeyMap.entries()).map(([key, val]) => [
          key,
          val,
        ]),
      );
    }

    return result;
  }

  deserialize(data: ICTsStateManagerSerializeData): CTsStateManager {
    this.keyValueMap = new Map();
    this.stateInKeyMap = new Map();
    this.stateOutKeyMap = new Map();

    for (const [key, val] of Object.entries(data.keyValueMap)) {
      this.keyValueMap.set(key, val);
    }

    for (const [key, set] of Object.entries(data.stateInKeyMap)) {
      this.stateInKeyMap.set(key, new Set(set));
    }

    for (const [key, val] of Object.entries(data.stateOutKeyMap)) {
      this.stateOutKeyMap.set(key, val);
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
}
