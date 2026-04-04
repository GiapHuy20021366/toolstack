import { useCallback } from "react";
import useEditorStateContext from "../useEditorStateContext";
import {
  CTsFuncManager,
  EFuncStateParamType,
  IFuncExecutorContextScope,
  IFuncState,
} from "../../../contexts/editor/func-manager";
import { resolvePath } from "@utils";
import { analyzeInput } from "@contexts/editor";

export default function useFuncExecutor() {
  const { stateManager } = useEditorStateContext();
  const execute = useCallback(
    async (
      func: IFuncState | Omit<IFuncState, "output" | "error">,
      scope: IFuncExecutorContextScope,
    ) => {
      const funcDef = CTsFuncManager.instance.getFunc(func.funcId);
      if (funcDef == null) return;
      try {
        const paramValues = func.params.map((param) => {
          switch (param.type) {
            case EFuncStateParamType.JSON:
              return JSON.parse(param.value);
            case EFuncStateParamType.STATE_KEY: {
              const pattern = analyzeInput(stateManager, param.value);
              return pattern.key;
            }
            case EFuncStateParamType.STATE_VALUE: {
              const pattern = analyzeInput(stateManager, param.value);
              return stateManager.getValue(pattern.key);
            }
            case EFuncStateParamType.SCOPE:
              return resolvePath(param.value, scope);
          }
        });
        const executor = funcDef.executor({
          scope: scope,
          stateManager: stateManager,
          funcDef: funcDef,
          funcState: func,
        });

        const output = executor(...paramValues);
        const outputValue = output instanceof Promise ? await output : output;
        if ("output" in func && func.output.funcId !== "none") {
          return await execute(func.output, {
            ...scope,
            $$output: outputValue,
          });
        } else {
          return outputValue;
        }
      } catch (error) {
        if ("error" in func && func.error.funcId !== "none") {
          return execute(func.error, { ...scope, $$error: error });
        } else {
          throw error;
        }
      }
    },
    [stateManager],
  );

  return {
    execute: execute,
  };
}
