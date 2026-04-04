/* eslint-disable @typescript-eslint/no-explicit-any */
import { analyzeInput, makeEditorRefKey } from "@contexts/editor";
import {
  CTsFuncManager,
  EFuncStateParamType,
  IFuncDef,
} from "../contexts/editor/func-manager";

const triggerFunctionFunc: IFuncDef = {
  id: "trigger-function-func",
  name: "triggerFunction",
  description: "",
  params: [
    {
      name: "name",
      description: "",
      type: "string",
      defaultType: EFuncStateParamType.STATE_KEY,
      defaultValue: "",
    },
    {
      name: "action",
      description: "",
      type: "any",
      defaultType: EFuncStateParamType.STATE_KEY,
      defaultValue: "action",
    },
  ],
  returnType: "void",
  isPromise: true,
  executor:
    ({ stateManager, scope }) =>
    async (name: unknown, behavior: unknown) => {
      const dependencies = analyzeInput(stateManager, String(name));
      const ref = stateManager.getValue(makeEditorRefKey(dependencies.key));
      if (
        ref == null ||
        typeof ref !== "object" ||
        typeof (ref as any)[String(behavior)] !== "function"
      ) {
        throw new Error("Failed to trigger the target function");
      }
      const action = (ref as any)[String(behavior)] as (
        ...params: unknown[]
      ) => unknown;
      return action(scope);
    },
  hasOutput: true,
  hasError: true,
};

CTsFuncManager.instance.registerFunc(triggerFunctionFunc);
