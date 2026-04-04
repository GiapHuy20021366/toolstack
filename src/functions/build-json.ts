/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CTsFuncManager,
  EFuncStateParamType,
  IFuncDef,
} from "../contexts/editor/func-manager";

const buildJsonFunc: IFuncDef = {
  id: "build-json-func",
  name: "buildJson",
  description: "",
  params: [
    {
      name: "key-val",
      description: "",
      type: "string",
      defaultType: EFuncStateParamType.STATE_KEY,
      defaultValue: "",
      series: true,
    },
  ],
  returnType: "object",
  isPromise: false,
  executor:
    () =>
    (...keyVals: unknown[]) => {
      const obj: Record<string, unknown> = {};
      for (let i = 0; i < keyVals.length; i += 2) {
        const key = String(keyVals[i]);
        const val = keyVals[i + 1];
        obj[key] = val;
      }
      return obj;
    },
  hasOutput: true,
  hasError: false,
};

CTsFuncManager.instance.registerFunc(buildJsonFunc);
