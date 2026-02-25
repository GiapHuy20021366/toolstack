import { useMemo } from "react";
import { makeGlobalStateKey } from "../manager/state-manager";
import useTsState, { IUseTsStateOptions } from "./useTsState";

export default function useTsGlobalState<T>(
  stateName: string,
  defaultValue: T,
) {
  const tsStateOptions = useMemo((): IUseTsStateOptions<T> => {
    const key = makeGlobalStateKey(stateName);
    return {
      key: key,
      defaultValue: defaultValue,
    };
  }, [defaultValue, stateName]);
  const rs = useTsState(tsStateOptions);
  return rs;
}
