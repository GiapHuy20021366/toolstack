import {
  IGraphicComponent,
  IGraphicComponentData,
  IGraphicComponentState,
  IGraphicComponentStateData,
} from "../manager/component-manager";
import {
  CTsStateManager,
  ICTsStateManagerSerializeData,
  makeGlobalKey,
  makeGraphicKey,
  makeGraphicStateInKey,
  makeGraphicStateKey,
  makeGraphicStateOutKey,
} from "../manager/state-manager";
import { getUID } from "../utils/uid-util";
import html2canvas from "html2canvas";
import { ACCESSORS } from "./getter";

export enum EGraphicEditorTabMenu {
  COMPONENT_MENU = "component-menu",
  TREE_MENU = "tree-menu",
  COMPONENT_STATE_MENU = "component-state-menu",
  COMPONENT_LAYOUT_MENU = "component-layout-menu",
  COMPONENT_INFO_MENU = "component-info-menu",
}

export const exportGraphic = (
  stateManager: CTsStateManager,
  controlCid: string,
): IGraphicComponentData | null => {
  const ACCESSOR_COMPONENT = ACCESSORS(stateManager).component(controlCid);
  const data = ACCESSOR_COMPONENT.data.get();
  if (data == null) {
    return null;
  }
  const layout = ACCESSOR_COMPONENT.data.layout.get();
  if (layout == null) {
    return null;
  }

  const nativeCid = ACCESSOR_COMPONENT.data.nativeCid.get();
  const children = ACCESSOR_COMPONENT.data.children.get() ?? [];

  const stateMap = ACCESSOR_COMPONENT.getStateDict();
  const stateInMap = ACCESSOR_COMPONENT.getStateInDict();
  const stateOutMap = ACCESSOR_COMPONENT.getStateOutDict();
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

  const rs: IGraphicComponentData = {
    cid: controlCid,
    name: ACCESSOR_COMPONENT.data.name.get() ?? "",
    nativeCid: nativeCid,
    description: ACCESSOR_COMPONENT.data.description.get() ?? "",

    layout: layout,
    children: [],

    state: state,

    visible: ACCESSOR_COMPONENT.data.visible.get() ?? true,
    classes: ACCESSOR_COMPONENT.data.classes.get() ?? "",
  };

  for (const child of children) {
    const graphic = exportGraphic(stateManager, child);
    if (graphic != null) {
      rs.children.push(graphic);
    }
  }

  return rs;
};

export const getStateManagerSerializeData = (
  graphic: IGraphicComponentData,
) => {
  const data: ICTsStateManagerSerializeData = {
    keyValueMap: {},
    stateInKeyMap: {},
    stateOutKeyMap: {},
  };
  return makeStateManagerSerializeData(graphic, data);
};

export const makeStateManagerSerializeData = (
  graphic: IGraphicComponentData,
  data: ICTsStateManagerSerializeData,
  parentGraphic?: IGraphicComponentData,
) => {
  // Layout
  data.keyValueMap[makeGraphicKey(graphic.cid, "data")] = graphic;
  data.keyValueMap[makeGraphicKey(graphic.cid, "data.cid")] = graphic.cid;
  data.keyValueMap[makeGraphicKey(graphic.cid, "data.name")] = graphic.name;
  data.keyValueMap[makeGraphicKey(graphic.cid, "data.native-cid")] =
    graphic.nativeCid;
  data.keyValueMap[makeGraphicKey(graphic.cid, "data.description")] =
    graphic.description;
  data.keyValueMap[makeGraphicKey(graphic.cid, "data.layout")] = graphic.layout;
  data.keyValueMap[makeGraphicKey(graphic.cid, "data.children")] =
    graphic.children.map((child) => child.cid);
  data.keyValueMap[makeGraphicKey(graphic.cid, "data.visible")] =
    graphic.visible;
  data.keyValueMap[makeGraphicKey(graphic.cid, "data.classes")] =
    graphic.classes;
  data.keyValueMap[makeGraphicKey(graphic.cid, "data.parent")] =
    parentGraphic?.cid;

  // State, state in , state out
  for (const { key, stateIn, stateOut, value } of Object.values(
    graphic.state,
  )) {
    if (value !== undefined) {
      data.keyValueMap[makeGraphicStateKey(graphic.cid, key)] = value;
    }
    if (stateOut != null) {
      data.keyValueMap[makeGraphicStateOutKey(graphic.cid, key)] = stateOut;
      data.stateOutKeyMap[makeGraphicKey(graphic.cid, key)] = makeGlobalKey(
        String(stateOut),
      );
    }
    if (stateIn != null) {
      data.keyValueMap[makeGraphicStateInKey(graphic.cid, key)] = stateIn;
      (data.stateInKeyMap[makeGlobalKey(String(stateIn))] ??= []).push(
        makeGraphicKey(graphic.cid, key),
      );
    }
  }

  // Children
  for (const child of graphic.children) {
    makeStateManagerSerializeData(child, data, graphic);
  }
  return data;
};

const updateGraphicComponentCid = (data: IGraphicComponentData) => {
  data.cid = getUID();
  for (const child of data.children) {
    updateGraphicComponentCid(child);
  }
};

export const cloneGraphicComponent = (graphic: IGraphicComponent) => {
  const cloned = JSON.parse(JSON.stringify(graphic)) as IGraphicComponent;
  updateGraphicComponentCid(cloned.data);
  cloned.cid = cloned.data.cid;
  return cloned;
};

export const captureElement = async (
  selector: string,
): Promise<string | null> => {
  const el = document.querySelector(selector) as HTMLElement | null;

  if (!el) {
    return null;
  }

  try {
    const canvas = await html2canvas(el, {
      useCORS: true,
      backgroundColor: null,
      scale: window.devicePixelRatio,
    });

    return canvas.toDataURL("image/png");
  } catch (err) {
    return null;
  }
};

export interface IGraphicScreenResolution {
  width: number;
  height: number;
  id: string;
  name: string;
}

export const SCREEN_RESOLUTIONS: IGraphicScreenResolution[] = [
  // ===== Desktop / Laptop =====
  {
    id: "hd",
    width: 1280,
    height: 720,
    name: "HD (1280×720)",
  },
  {
    id: "hd_plus",
    width: 1600,
    height: 900,
    name: "HD+ (1600×900)",
  },
  {
    id: "full_hd",
    width: 1920,
    height: 1080,
    name: "Full HD (1920×1080)",
  },
  {
    id: "2k",
    width: 2560,
    height: 1440,
    name: "2K / QHD (2560×1440)",
  },
  {
    id: "4k",
    width: 3840,
    height: 2160,
    name: "4K / UHD (3840×2160)",
  },

  // ===== Apple =====
  {
    id: "macbook_air_13",
    width: 1440,
    height: 900,
    name: 'MacBook Air 13" (1440×900)',
  },
  {
    id: "macbook_pro_14",
    width: 3024,
    height: 1964,
    name: 'MacBook Pro 14" (3024×1964)',
  },
  {
    id: "macbook_pro_16",
    width: 3456,
    height: 2234,
    name: 'MacBook Pro 16" (3456×2234)',
  },

  // ===== Custom =====
  {
    id: "custom",
    width: 0,
    height: 0,
    name: "Custom",
  },
] as const;

export enum EGraphicEditorWorkspaceMode {
  VIEW = "view",
  EDIT = "edit"
}
