import {
  IGraphicComponent,
  IGraphicComponentData,
  IGraphicComponentState,
  IGraphicComponentStateData,
  ILayoutBounds,
} from "../manager/component-manager";
import {
  CTsStateManager,
  makeCommonStateKey,
  makeComponentLayoutStateKey,
  makeComponentStateInKey,
  makeComponentStateKey,
  makeComponentStateOutKey,
} from "../manager/state-manager";
import { getUID } from "../utils/uid-util";

export const LAYOUT_DATA_HELPER = {
  /**
   * Export the graphic data
   * @param stateManager
   * @param controlCid
   */
  getGraphicComponentData: (
    stateManager: CTsStateManager,
    controlCid: string,
  ): IGraphicComponentData | null => {
    const data = stateManager.getValue<IGraphicComponentData>(
      makeComponentLayoutStateKey(controlCid, "data"),
    );
    if (data == null) {
      return null;
    }
    const layout = stateManager.getValue<ILayoutBounds>(
      makeComponentLayoutStateKey(controlCid, "layout"),
    );
    if (layout == null) {
      return null;
    }
    const stateMap = stateManager.getStateDictionaryByPrefix(
      makeComponentStateKey(controlCid, ""),
    );
    const stateInMap = stateManager.getStateDictionaryByPrefix(
      makeComponentStateInKey(controlCid, ""),
    );
    const stateOutMap = stateManager.getStateDictionaryByPrefix(
      makeComponentStateOutKey(controlCid, ""),
    );
    const state: IGraphicComponentState = {};
    for (const [key, value] of Object.entries(stateMap)) {
      const stateData: IGraphicComponentStateData = {
        key: key,
        value: value,
        stateIn: stateInMap[key],
        stateOut: stateOutMap[key],
      };
      state[key] = stateData;
    }
    const nativeCid = stateManager.getValue<string>(
      makeComponentLayoutStateKey(controlCid, "native.cid"),
    );
    const children =
      stateManager.getValue<string[]>(
        makeComponentLayoutStateKey(controlCid, "children"),
      ) ?? [];

    const rs: IGraphicComponentData = {
      cid: controlCid,
      description: data.description,
      layout: layout,
      name: data.name,
      state: state,
      nativeCid: nativeCid,
      children: [],
    };

    for (const child of children) {
      const graphic = LAYOUT_DATA_HELPER.getGraphicComponentData(
        stateManager,
        child,
      );
      if (graphic != null) {
        rs.children.push(graphic);
      }
    }

    return rs;
  },

  setGraphicComponentData: (
    stateManager: CTsStateManager,
    data: IGraphicComponentData,
    parentCid?: string | null,
  ) => {
    // Component layout: data, layout, parent, children
    stateManager.setValue(makeComponentLayoutStateKey(data.cid, "data"), data);
    stateManager.setValue(
      makeComponentLayoutStateKey(data.cid, "layout"),
      data.layout,
    );
    stateManager.setValue(
      makeComponentLayoutStateKey(data.cid, "native.cid"),
      data.nativeCid,
    );
    const childrenCids = data.children.map((child) => child.cid);
    stateManager.setValue(
      makeComponentLayoutStateKey(data.cid, "parent"),
      parentCid,
    );
    for (const child of data.children) {
      LAYOUT_DATA_HELPER.setGraphicComponentData(stateManager, child, data.cid);
    }
    if (parentCid) {
      stateManager.setValue(
        makeComponentLayoutStateKey(data.cid, "children"),
        childrenCids,
      );
      const parentChildren =
        stateManager.getValue<string[]>(
          makeComponentLayoutStateKey(parentCid, "children"),
        ) ?? [];
      stateManager.setValue(
        makeComponentLayoutStateKey(parentCid, "children"),
        [...parentChildren, data.cid],
      );
    } else {
      stateManager.setValue(makeCommonStateKey("selected.cid"), data.cid);
    }

    // Component state value, state in, state out
    for (const { key, stateIn, stateOut, value } of Object.values(data.state)) {
      if (value !== undefined) {
        stateManager.setValue(makeComponentStateKey(data.cid, key), value);
      }
      if (stateIn != null && typeof stateIn === "string") {
        stateManager.setValue(makeComponentStateInKey(data.cid, key), stateIn);
      }
      if (stateOut != null && typeof stateOut === "string") {
        stateManager.setValue(
          makeComponentStateOutKey(data.cid, key),
          stateOut,
        );
      }
    }
  },

  /**
   * Update the cid to another cid
   * @param data
   */
  updateGraphicComponentCid: (data: IGraphicComponentData) => {
    data.cid = getUID();
    for (const child of data.children) {
      LAYOUT_DATA_HELPER.updateGraphicComponentCid(child);
    }
  },

  /**
   * Clone the graphic component
   * @param graphic
   * @returns
   */
  cloneGraphicComponent: (graphic: IGraphicComponent) => {
    const cloned = JSON.parse(JSON.stringify(graphic)) as IGraphicComponent;
    LAYOUT_DATA_HELPER.updateGraphicComponentCid(cloned.data);
    cloned.cid = cloned.data.cid;
    return cloned;
  },
} as const;
