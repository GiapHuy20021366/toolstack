/* eslint-disable @typescript-eslint/no-explicit-any */
import { ETsVersion } from "./version-manager";
import EventEmitter from "eventemitter3";

export enum ENativeComponentRole {
  ELEMENT = 1,
  CONTAINER = 2,
  LAYER = 3,
  SCREEN = 4,
}

export enum EComponentTag {
  LAYOUT = "Layout",
  INPUT = "Input",
  GRAPHIC_PIECE = "Graphic Piece",
  OTHER = "Other",
}

export interface IComponentTagInfo {
  id: string;
  name: string;
  description: string;
}

export const COMPONENT_TAG_INFO_MAP: Record<EComponentTag, IComponentTagInfo> = {
  [EComponentTag.LAYOUT]: {
    id: "layout",
    name: "Layout",
    description: ""
  },
  [EComponentTag.INPUT]: {
    id: "input",
    name: "Input",
    description: ""
  },
  [EComponentTag.GRAPHIC_PIECE]: {
    id: "graphic_piece",
    name: "Graphic piece",
    description: ""
  },
  [EComponentTag.OTHER]: {
    id: "other",
    name: "Other",
    description: ""
  }
} as const;

export interface ILayoutBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface INativeStateProps<IOptions> {
  cid: string;
  state: INativeComponentState<IOptions>;
  options?: IOptions;
}

export interface INativeComponentState<
  IOptions = unknown,
  IProps = INativeStateProps<IOptions>,
> {
  name: string;
  type: string;
  description: string;
  defaultValue: any;
  isStateIn?: boolean; // default true
  isStateOut?: boolean; // default true
  hide?: boolean; // default false
  editable?: boolean; // default true
  editor?: {
    element: (props: IProps) => JSX.Element;
    options: IOptions;
  };
  validator?: (value: any) => string[] | null;
  encoder?: (value: any) => string;
  decoder?: (value: string) => any;
}

/**
 * Native component
 */
export interface INativeComponent<Props = unknown> {
  cid: string;
  name: string; // Name (unique)
  description: string;
  version: ETsVersion;
  states: INativeComponentState<any>[]; //State definition
  layout: ILayoutBounds; // Default layout
  image: string; // Url of review image
  element: (props?: Props) => JSX.Element; // Render element
  role: ENativeComponentRole;
  tag: EComponentTag;
}

export interface IGraphicComponentStateData {
  key: string;
  value?: unknown;
  stateIn?: unknown;
  stateOut?: unknown;
}

export interface IGraphicComponentState {
  [key: string]: IGraphicComponentStateData;
}

export interface IGraphicComponentData {
  cid: string;
  name: string;
  nativeCid?: string; //Id of native component
  description: string;

  layout: ILayoutBounds;
  children: IGraphicComponentData[];

  state: IGraphicComponentState;

  visible: boolean;
  classes: string;
}

/**
 * Graphic component
 */
export interface IGraphicComponent {
  cid: string;
  name: string;
  description: string;
  image: string;
  time: number;
  data: IGraphicComponentData;
}

export class CTsComponentManager extends EventEmitter {
  private static _instance: CTsComponentManager;
  public static get instance() {
    return (CTsComponentManager._instance ??= new CTsComponentManager());
  }

  private constructor() {
    super();
    this.loadAll();
  }

  private nativeComponentMap: Map<string, INativeComponent<any>> = new Map();
  private graphicComponentMap: Map<string, IGraphicComponent> = new Map();

  public registerNativeComponent(component: INativeComponent<any>) {
    this.nativeComponentMap.set(component.cid, component);
    this.emit("change", this);
  }

  public registerGraphicComponent(component: IGraphicComponent) {
    this.graphicComponentMap.set(component.cid, component);
    this.saveGraphicComponent(component);
    this.emit("change", this);
  }

  public getNativeComponent(cid: string) {
    return this.nativeComponentMap.get(cid);
  }

  public getGraphicComponent(cid: string) {
    return this.graphicComponentMap.get(cid);
  }

  public getComponentType(name: string) {
    if (this.nativeComponentMap.has(name)) return "native";
    if (this.graphicComponentMap.has(name)) return "graphic";
    return "other";
  }

  public removeGraphic(cid: string) {
    const component = this.graphicComponentMap.get(cid);
    if (component != null) {
      this.graphicComponentMap.delete(cid);
      localStorage.removeItem(this.getSavingGraphicComponentKey(cid));
      this.emit("change", this);
    }
  }

  public get nativeComponents() {
    return [...this.nativeComponentMap.values()];
  }

  public get graphicComponents() {
    return [...this.graphicComponentMap.values()];
  }

  private getSavingGraphicComponentKey(cid: string) {
    return `@graphic-component.${cid}`;
  }

  private loadAll() {
    const prefix = this.getSavingGraphicComponentKey("");
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(prefix)) {
        const component = JSON.parse(
          localStorage.getItem(key)!,
        ) as IGraphicComponent;
        this.graphicComponentMap.set(component.cid, component);
      }
    }
    this.emit("change", this);
  }
  private saveGraphicComponent(component: IGraphicComponent) {
    const key = this.getSavingGraphicComponentKey(component.cid);
    localStorage.setItem(key, JSON.stringify(component));
  }
}
