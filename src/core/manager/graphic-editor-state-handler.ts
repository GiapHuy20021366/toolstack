import {
  EGraphicEditorHandlerTag,
  GraphicEditorHandler,
} from "./graphic-editor-handler";
import { TsVariableManagerEvent, ISetValueEventData } from "./variable-manager";

/**
 * A handler for handle:
 * - component state
 * - component state in
 * - component state out
 * - global state
 */
export class GraphicEditorStateHandler extends GraphicEditorHandler {
  // Mapping between global state -> all local states
  private stateInKeyMap: Map<string, Set<string>> = new Map();
  // Mapping between local state ->  global states
  private stateOutKeyMap: Map<string, string> = new Map();

  init(): void {
    const parent = this.parent;
    // Handle state in, state out reflection
    parent.addListener(
      TsVariableManagerEvent.SET_VALUE_ANY,
      (data: ISetValueEventData) => {
        const { key, oldValue, newValue } = data as ISetValueEventData<string>;
        const [tag] = GraphicEditorHandler.parseStateKey(key);
        switch (tag) {
          case EGraphicEditorHandlerTag.COMPONENT_STATE_IN: {
            const [, cid, stateName] = GraphicEditorHandler.parseStateKey(key);
            const componentStateKey =
              GraphicEditorStateHandler.getComponentStateKey(cid, stateName);
            // Remove in old set
            if (oldValue) {
              // remove in old set
              const oldGlobalStateKey =
                GraphicEditorStateHandler.getGlobalStateKey(oldValue);
              const set = this.stateInKeyMap.get(oldGlobalStateKey);
              if (set != null) {
                set.delete(componentStateKey);
                if (set.size == 0) {
                  this.stateInKeyMap.delete(oldGlobalStateKey);
                }
              }
            }
            // Add in new set
            const globalKey =
              GraphicEditorStateHandler.getGlobalStateKey(newValue);
            if (newValue) {
              const set = this.stateInKeyMap.get(globalKey) ?? new Set();
              set.add(componentStateKey);
              this.stateInKeyMap.set(globalKey, set);
            }
            // Reflect value
            const reflectValue = this.parent.getValue(globalKey);
            if (reflectValue !== undefined) {
              this.parent.setValue(
                componentStateKey,
                this.parent.getValue(globalKey),
              );
            }
            break;
          }
          case EGraphicEditorHandlerTag.COMPONENT_STATE_OUT: {
            if (newValue) {
              const [, cid, stateName] =
                GraphicEditorHandler.parseStateKey(key);
              const componentStateKey =
                GraphicEditorStateHandler.getComponentStateKey(cid, stateName);
              const globalKey =
                GraphicEditorStateHandler.getGlobalStateKey(newValue);
              this.stateOutKeyMap.set(componentStateKey, globalKey);
              // Reflect value
              const reflectValue = parent.getValue(componentStateKey);
              if (reflectValue !== undefined) {
                parent.setValue(globalKey, parent.getValue(componentStateKey));
              }
            }
            break;
          }
          case EGraphicEditorHandlerTag.COMPONENT_STATE: {
            // Reflect value out
            const outKey = this.stateOutKeyMap.get(key);
            if (outKey) {
              parent.setValue(outKey, newValue);
            }

            // Reflect value in
            const inSet = this.stateInKeyMap.get(key);
            if (inSet) {
              for (const inKey of inSet) {
                parent.setValue(inKey, newValue);
              }
            }
            break;
          }
          case EGraphicEditorHandlerTag.GLOBAL_STATE: {
            // Reflect value out
            const outKey = this.stateOutKeyMap.get(key);
            if (outKey) {
              parent.setValue(outKey, newValue);
            }

            // Reflect value in
            const inSet = this.stateInKeyMap.get(key);
            if (inSet) {
              for (const inKey of inSet) {
                parent.setValue(inKey, newValue);
              }
            }
            break;
          }
        }
      },
    );
  }

  static getComponentStateKey(cid: string, stateName: string) {
    return GraphicEditorHandler.makeStateKey(
      EGraphicEditorHandlerTag.COMPONENT_STATE,
      cid,
      stateName,
    );
  }

  static getComponentStateInKey(cid: string, stateName: string) {
    return GraphicEditorHandler.makeStateKey(
      EGraphicEditorHandlerTag.COMPONENT_STATE_IN,
      cid,
      stateName,
    );
  }

  static getComponentStateOutKey(cid: string, stateName: string) {
    return GraphicEditorHandler.makeStateKey(
      EGraphicEditorHandlerTag.COMPONENT_STATE_OUT,
      cid,
      stateName,
    );
  }

  static getGlobalStateKey(stateName: string) {
    return GraphicEditorHandler.makeStateKey(
      EGraphicEditorHandlerTag.GLOBAL_STATE,
      "global",
      stateName,
    );
  }
}
