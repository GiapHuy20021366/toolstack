import { useCallback } from "react";
import useEditorStateContext from "../useEditorStateContext";
import {
  CTsFuncManager,
  EFuncStateParamType,
  IFuncExecutorContextScope,
  IFuncState,
} from "../../../contexts/editor/func-manager";
import { resolvePath } from "@utils";
import {
  analyzeInput,
  IFuncDataManage,
  IFuncOperationInfo,
} from "@contexts/editor";

export default function useFuncExecutor() {
  const { stateManager } = useEditorStateContext();
  const execute = useCallback(
    async (
      func: IFuncState | Omit<IFuncState, "output" | "error">,
      scope: IFuncExecutorContextScope,
      info: Omit<IFuncDataManage["info"], "functionId">,
    ) => {
      // Check if the function is stopped or rejected before execution
      if (scope.isStopped) {
        return;
      }
      if (scope.isRejected) {
        throw new Error("Function rejected");
      }

      const funcDef = CTsFuncManager.instance.getFunc(func.funcId);
      if (funcDef == null) return;

      // Wait flag
      let flagData: IFuncOperationInfo | null = null;
      try {
        flagData = await stateManager.functionStateHandler.waitForResume({
          ...info,
          functionId: func.funcId,
        });
      } catch (error) {
        flagData = error as IFuncOperationInfo;
      }

      scope.isStopped = flagData.code === "stop";
      scope.isRejected = flagData.code === "reject";
      if (scope.isStopped) {
        return;
      }
      if (scope.isRejected) {
        throw new Error("Function rejected");
      }

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
            case EFuncStateParamType.TEXT:
              return String(param.value);
            case EFuncStateParamType.DEFAULT:
              return param.value;
            default:
              return param.value;
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
          return await execute(
            func.output,
            {
              ...scope,
              $$output: outputValue,
            },
            {
              ...info,
              actionName: info.actionName + "." + "output",
            },
          );
        } else {
          return outputValue;
        }
      } catch (error) {
        if ("error" in func && func.error.funcId !== "none") {
          return execute(
            func.error,
            { ...scope, $$error: error },
            {
              ...info,
              actionName: info.actionName + "." + "error",
            },
          );
        } else {
          throw error;
        }
      }
    },
    [stateManager],
  );

  /**
   * A wrapper for executing a function, can be used for executing any async function with the same error handling as func executor
   */
  const executeFunc = useCallback(
    async (
      func: (scope: IFuncExecutorContextScope) => Promise<void>,
      scope: IFuncExecutorContextScope,
      info: Omit<IFuncDataManage["info"], "functionId">,
    ) => {
      // Check if the function is stopped or rejected before execution
      if (scope.isStopped) {
        return;
      }
      if (scope.isRejected) {
        throw new Error("Function rejected");
      }

      // Wait flag
      let flagData: IFuncOperationInfo | null = null;
      try {
        flagData = await stateManager.functionStateHandler.waitForResume({
          ...info,
          functionId: "",
        });
      } catch (error) {
        flagData = error as IFuncOperationInfo;
      }

      scope.isStopped = flagData.code === "stop";
      scope.isRejected = flagData.code === "reject";
      if (scope.isStopped) {
        return;
      }
      if (scope.isRejected) {
        throw new Error("Function rejected");
      }
      return await func(scope);
    },
    [stateManager],
  );

  return {
    execute: execute,
    executeFunc: executeFunc,
  };
}
