import { GraphicEditorDataManager } from "./graphic-editor-data-manager";

export enum EGraphicEditorHandlerTag {
  COMPONENT_STATE = "@component-state",
  COMPONENT_STATE_IN = "@component-state-in",
  COMPONENT_STATE_OUT = "@component-state-out",
  GLOBAL_STATE = "@global-state",

  GRAPHIC_COMPONENT_LAYOUT = "@graphic-component-layout",
  GRAPHIC_COMMON = "@graphic-common",
}

export abstract class GraphicEditorHandler {
  protected _parent: GraphicEditorDataManager;

  constructor(parent: GraphicEditorDataManager) {
    this._parent = parent;
  }

  get parent() {
    return this._parent;
  }

  static makeStateKey(...parts: string[]) {
    return parts.join(".");
  }

  static parseStateKey(key: string, limit = 3) {
    return key.split(key, limit);
  }

  /**
   * Init handler
   */
  abstract init(): void;
}
