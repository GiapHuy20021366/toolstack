import {
  EditorStateManager,
  IGraphicComponent,
  IGraphicComponentData,
  IGraphicComponentState,
  IGraphicComponentStateData,
} from "@contexts/editor";
import { ACCESSORS } from "./accessor";
import { getUID } from "@/utils";
import html2canvas from "html2canvas";
import { tsFunctionComponent } from "@components/pieces/functions/TsFunction.config";
import { tsGroupFunctionComponent } from "@components/pieces/functions/TsGroupFunction.config";

export const exportGraphic = (
  stateManager: EditorStateManager,
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

/**
 *
 * @param e
 * @param element
 * @returns
 */
export const getRelativeMousePositionByEvent = (
  e: MouseEvent,
  element: HTMLElement,
) => {
  return getRelativeMousePositionByClient(e.clientX, e.clientY, element);
};

/**
 *
 * @param e
 * @param element
 * @returns
 */
export const getRelativeMousePositionByClient = (
  clientX: number,
  clientY: number,
  element: HTMLElement,
) => {
  const rect = element.getBoundingClientRect();

  // GUI coordinate (included scale, transform)
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  // Real scale
  const scaleX = rect.width / element.offsetWidth;
  const scaleY = rect.height / element.offsetHeight;

  // Normalize to root coordinate (before transform, scroll)
  const logicalX = x / scaleX + element.scrollLeft;
  const logicalY = y / scaleY + element.scrollTop;

  return { x: logicalX, y: logicalY };
};

export const listAllSubFunctions = (
  stateManager: EditorStateManager,
  cid: string,
  rs: string[] = [],
) => {
  const ACC = ACCESSORS(stateManager);
  const ACC_COMPONENT = ACC.component(cid);
  const children = ACC_COMPONENT.data.children.get() ?? [];
  for (const child of children) {
    const CHILD_ACC_COMPONENT = ACC.component(child);
    const nativeCid = CHILD_ACC_COMPONENT.data.nativeCid.get();
    if (
      nativeCid === tsFunctionComponent.cid ||
      nativeCid === tsGroupFunctionComponent.cid
    ) {
      rs.push(child);
    }
    // In case of group function => do not loop nested child any more
    if (nativeCid === tsGroupFunctionComponent.cid) {
      continue;
    }
    listAllSubFunctions(stateManager, child, rs);
  }
  return rs;
};
