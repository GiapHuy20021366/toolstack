/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditorStateHandler } from "./editor-state-handler";
import { getUID } from "@utils";

export interface IFuncOperationInfo {
  code: "resume" | "reject" | "stop" | "continue";
  message: string;
}

export interface IFuncDataManage {
  resolver: typeof Promise.resolve;
  rejecter: typeof Promise.reject;
  info: {
    cid: string;
    actionName: string;
    functionId: string;
  };
}

export class FunctionStateHandler extends EditorStateHandler {
  private _isPausing: boolean = false;
  private _dataMap: Record<string, IFuncDataManage> = {};

  public reset() {
    // Do nothing
  }

  public load() {
    // Do nothing
  }
  protected init() {
    // Do nothing
  }

  public pause() {
    this._isPausing = true;
  }

  public resume() {
    this._isPausing = false;
    for (const key in this._dataMap) {
      const data = this._dataMap[key];
      data.resolver({
        code: "resume",
        message: "Function resumed",
      } as IFuncOperationInfo);
      delete this._dataMap[key];
    }
  }

  public reject(id: string) {
    const data = this._dataMap[id];
    if (data) {
      data.rejecter({
        code: "reject",
        message: "Function rejected",
      } as IFuncOperationInfo);
      delete this._dataMap[id];
    }
  }

  public stop(id: string) {
    const data = this._dataMap[id];
    if (data) {
      data.resolver({
        code: "stop",
        message: "Function stopped",
      } as IFuncOperationInfo);
      delete this._dataMap[id];
    }
  }

  public rejectAll(reason?: any) {
    for (const key in this._dataMap) {
      const data = this._dataMap[key];
      data.rejecter(reason);
      delete this._dataMap[key];
    }
  }

  public async waitForResume(
    info: IFuncDataManage["info"],
  ): Promise<IFuncOperationInfo> {
    if (this._isPausing) {
      return new Promise<IFuncOperationInfo>((resolve, reject) => {
        this._dataMap[getUID("Func")] = {
          resolver: resolve as any,
          rejecter: reject as any,
          info,
        };
      });
    }
    return {
      code: "continue",
      message: "Function continued",
    };
  }
}
