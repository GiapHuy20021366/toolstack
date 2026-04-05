import EventEmitter from "eventemitter3";
import { EditorStateManager } from "./state/editor-state-manager";

export enum EFuncDefParamEditorType {
  INPUT = "input",
  SELECT = "select",
  CHECKBOX = "checkbox",
  FUNCTION = "function",
}

export interface IFunDefParamSelectOption {
  label: string;
  value: string;
}

/**
 * Func param definition
 */
export interface IIFuncDefParam {
  name: string;
  description: string;
  type: string;

  series?: boolean; // ...params
  defaultType?: EFuncStateParamType;
  defaultValue?: string;

  elementType?: EFuncDefParamEditorType;
  options?: IFunDefParamSelectOption[];
}

export interface IFuncExecutorContextScope {
  [key: string]: unknown;
}
/**
 * Func exe context
 */
export interface IFuncExecutorContext {
  scope: IFuncExecutorContextScope;
  stateManager: EditorStateManager;
  funcDef: IFuncDef;
  funcState: IFuncState | Omit<IFuncState, "output" | "error">;
}
export type FFuncExecutor = (
  context: IFuncExecutorContext,
) => (...params: unknown[]) => unknown;

/**
 * Function definition
 */
export interface IFuncDef {
  id: string;
  name: string;
  description: string;
  params: IIFuncDefParam[];
  returnType: string;
  isPromise: boolean;

  executor: FFuncExecutor;
  hasOutput?: boolean; //default true
  hasError?: boolean; //default true
}

export enum EFuncStateParamType {
  DEFAULT = "default",
  JSON = "json",
  STATE_KEY = "state-key",
  STATE_VALUE = "state-value",
  SCOPE = "scope",
  TEXT = "text",
}

/**
 * Func state editor param definition
 */
export interface IFuncStateParam {
  type: EFuncStateParamType;
  value: string;
}

/**
 * Func state editor definition
 */
export interface IFuncState {
  funcId: string;
  params: IFuncStateParam[];
  output: Omit<IFuncState, "output" | "error">;
  error: Omit<IFuncState, "output" | "error">;
}

/**
 * Fun exe resource definition
 */
export interface IFuncExeResource {
  state: IFuncState;
  scope: Record<string, unknown>;
}

export class CTsFuncManager extends EventEmitter {
  private static _instance: CTsFuncManager;
  public static get instance() {
    return (CTsFuncManager._instance ??= new CTsFuncManager());
  }

  private funcMap: Map<string, IFuncDef> = new Map();

  public registerFunc(func: IFuncDef) {
    this.funcMap.set(func.id, func);
    this.emit("change", this);
  }

  public removeFunc(func: IFuncDef) {
    this.funcMap.delete(func.id);
    this.emit("change", this);
  }

  public getFunc(id: string) {
    return this.funcMap.get(id);
  }

  public getListFunc() {
    return [...this.funcMap.values()];
  }
}

export const getDefaultFuncStateValue = (): IFuncState => ({
  funcId: "",
  params: [],
  output: {
    funcId: "",
    params: [],
  },
  error: {
    funcId: "",
    params: [],
  },
});
