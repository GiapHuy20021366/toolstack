import { analyzeInput, IDependencies } from "./state-analyze-helper";
import { EditorStateHandler } from "./editor-state-handler";
import {
  EEditorStateManagerTag,
  editorStateManagerEvent,
} from "./editor-state-manager";
import {
  stateManagerEvent,
  ISetValueEventData,
} from "../../common/state-manager";

export class GlobalStateHandler extends EditorStateHandler {
  // Mapping from state to its dependencies
  private _stateToDependenciesMap: Map<string, IDependencies> = new Map();
  private _stateToStateMap: Map<string, Record<string, number>> = new Map();
  private _graphicNameToStateMap: Map<string, Record<string, number>> =
    new Map();

  public reset() {
    this._stateToDependenciesMap = new Map();
    this._stateToStateMap = new Map();
    this._graphicNameToStateMap = new Map();
  }

  public load() {
    for (const [key, value] of this.parent.keyValueMap.entries()) {
      if (key.endsWith(".in") || key.endsWith(".out")) {
        this.handleDependencies(key, String(value) ?? null);
      }
    }
  }

  protected init() {
    this.handleUpdateDependencies();
    this.handleStateInOut();
    this.handleStateChange();
  }

  private handleDependencies(key: string, newValue: string | null) {
    // Remove old value effects
    const dependencies = this._stateToDependenciesMap.get(key);
    if (dependencies != null) {
      const keys = [...dependencies.keys, dependencies.key];
      for (const dependencyKey of keys) {
        const record = this._stateToStateMap.get(dependencyKey);
        if (record) {
          if (record[key] != null) {
            --record[key];

            // Remove map
            if (record[key] <= 0) {
              delete record[key];
            }
          }

          // Remove key
          if (Object.keys(record).length === 0) {
            this._stateToStateMap.delete(dependencyKey);
          }
        }
      }
      for (const name of dependencies.names) {
        const record = this._graphicNameToStateMap.get(name);
        if (record) {
          if (record[key] != null) {
            --record[key];

            // Remove map
            if (record[key] <= 0) {
              delete record[key];
            }
          }

          // Remove key
          if (Object.keys(record).length === 0) {
            this._graphicNameToStateMap.delete(name);
          }
        }
      }
    }
    this._stateToDependenciesMap.delete(key);

    // Update new value effects
    if (newValue) {
      const newDependencies = analyzeInput(this.parent, newValue);
      this._stateToDependenciesMap.set(key, newDependencies);
      let dependKey = newDependencies.key;
      if (key.endsWith(".out")) {
        dependKey = key.slice(0, key.length - 3) + "value";
      }
      const keys = [...newDependencies.keys, dependKey];
      for (const dependencyKey of keys) {
        const record = this._stateToStateMap.get(dependencyKey) ?? {};
        record[key] ??= 0;
        ++record[key];
        this._stateToStateMap.set(dependencyKey, record);
      }
      for (const name of newDependencies.names) {
        const record = this._graphicNameToStateMap.get(name) ?? {};
        record[key] ??= 0;
        ++record[key];
        this._graphicNameToStateMap.set(name, record);
      }
      this.handleStateValueChange(dependKey, this.parent.getValue(dependKey));
    }

    return;
  }

  private handleUpdateDependencies() {
    const parent = this.parent;
    parent.addListener(
      stateManagerEvent.INNER_SET_VALUE_ANY,
      (data: ISetValueEventData) => {
        const { key } = data as ISetValueEventData<string>;
        const record = this._stateToStateMap.get(key) ?? {};
        for (const [reflectKey, count] of Object.entries(record)) {
          if (count <= 0) {
            continue;
          }
          const dependencies = this._stateToDependenciesMap.get(reflectKey);
          if (dependencies != null && dependencies.keys.includes(key)) {
            this.handleDependencies(
              reflectKey,
              parent.getValue<string>(reflectKey) ?? null,
            );
          }
        }
      },
    );
    parent.addListener(
      editorStateManagerEvent.SET_GRAPHIC_NAME,
      (data: ISetValueEventData) => {
        const { newValue: name } = data as ISetValueEventData<string>;
        if (name) {
          const record = this._graphicNameToStateMap.get(name) ?? {};
          for (const [reflectKey, count] of Object.entries(record)) {
            if (count <= 0) {
              continue;
            }
            const dependencies = this._stateToDependenciesMap.get(reflectKey);
            if (dependencies != null) {
              this.handleDependencies(
                reflectKey,
                parent.getValue<string>(reflectKey) ?? null,
              );
            }
          }
        }
      },
    );
  }

  private handleStateInOut() {
    const parent = this.parent;
    parent.addListener(
      stateManagerEvent.INNER_SET_VALUE_ANY,
      (data: ISetValueEventData) => {
        const { key, newValue } = data as ISetValueEventData<string>;
        const [tag] = key.split(".");
        if (tag === EEditorStateManagerTag.STATE) {
          // Graphic state in/out change handle
          if (key.endsWith(".in") || key.endsWith(".out")) {
            this.handleDependencies(key, newValue);
            return;
          }
        }
      },
    );
  }

  private handleStateChange() {
    const parent = this.parent;
    parent.addListener(
      stateManagerEvent.INNER_SET_VALUE_ANY,
      (data: ISetValueEventData) => {
        const { key, newValue } = data as ISetValueEventData<string>;
        this.handleStateValueChange(key, newValue);
      },
    );
  }

  private handleStateValueChange(key: string, newValue: unknown) {
    const record = this._stateToStateMap.get(key) ?? {};
    for (const [reflectKey, count] of Object.entries(record)) {
      if (count <= 0) {
        continue;
      }
      if (reflectKey.endsWith(".in")) {
        const dependencies = this._stateToDependenciesMap.get(reflectKey);
        if (dependencies != null && dependencies.key === key) {
          const valueKey = reflectKey.replace(".in", ".value");
          this.parent.setValue(valueKey, newValue);
        }
      } else if (reflectKey.endsWith(".out")) {
        const dependencies = this._stateToDependenciesMap.get(reflectKey);
        if (dependencies) {
          this.parent.setValue(dependencies.key, newValue);
        }
      } else {
        const dependencies = this._stateToDependenciesMap.get(reflectKey);
        if (dependencies != null && dependencies.key === key) {
          this.parent.setValue(reflectKey, newValue);
        }
      }
    }
  }
}
