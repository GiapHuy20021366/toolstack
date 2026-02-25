import {
  CTsVariableManager,
  ISetValueEventData,
  TsVariableManagerEvent,
} from "./variable-manager";

export enum EStateManagerTag {
  COMPONENT_STATE = "@component-state",
  GLOBAL_STATE = "@global-state",
  COMPONENT_STATE_IN = "@component-state-in",
  COMPONENT_STATE_OUT = "@component-state-out",
}

export const makeStateManagerKey = (...params: string[]) => {
  return params.join(".");
};

export const makeComponentStateKey = (cid: string, stateName: string) =>
  `${EStateManagerTag.COMPONENT_STATE}.${cid}.${stateName}`;
export const makeComponentStateInKey = (cid: string, stateName: string) =>
  `${EStateManagerTag.COMPONENT_STATE_IN}.${cid}.${stateName}`;
export const makeComponentStateOutKey = (cid: string, stateName: string) =>
  `${EStateManagerTag.COMPONENT_STATE_OUT}.${cid}.${stateName}`;
export const makeGlobalStateKey = (stateName: string) =>
  `${EStateManagerTag.GLOBAL_STATE}.global.${stateName}`;

export class CTsStateManager extends CTsVariableManager {
  // Mapping between global state -> all local states
  private stateInKeyMap: Map<string, Set<string>> = new Map();
  // Mapping between local state ->  global states
  private stateOutKeyMap: Map<string, string> = new Map();
  constructor() {
    super();

    // Handle state in, state out reflection
    this.addListener(
      TsVariableManagerEvent.SET_VALUE_ANY,
      (data: ISetValueEventData) => {
        const { key, oldValue, newValue } = data as ISetValueEventData<string>;
        const [tag] = key.split(".");
        switch (tag) {
          case EStateManagerTag.COMPONENT_STATE_IN: {
            const [, cid, stateName] = key.split(".");
            const componentStateKey = makeComponentStateKey(cid, stateName);
            // Remove in old set
            if (oldValue) {
              // remove in old set
              const oldGlobalStateKey = makeGlobalStateKey(oldValue);
              const set = this.stateInKeyMap.get(oldGlobalStateKey);
              if (set != null) {
                set.delete(componentStateKey);
                if (set.size == 0) {
                  this.stateInKeyMap.delete(oldGlobalStateKey);
                }
              }
            }
            // Add in new set
            const globalKey = makeGlobalStateKey(newValue);
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
            break;
          }
          case EStateManagerTag.COMPONENT_STATE_OUT: {
            if (newValue) {
              const [, cid, stateName] = key.split(".");
              const componentStateKey = makeComponentStateKey(cid, stateName);
              const globalKey = makeGlobalStateKey(newValue);
              this.stateOutKeyMap.set(componentStateKey, globalKey);
              // Reflect value
              const reflectValue = this.getValue(componentStateKey);
              if (reflectValue !== undefined) {
                this.setValue(globalKey, this.getValue(componentStateKey));
              }
            }
            break;
          }
          case EStateManagerTag.COMPONENT_STATE: {
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
            break;
          }
          case EStateManagerTag.GLOBAL_STATE: {
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
            break;
          }
        }
      },
    );
  }
}
