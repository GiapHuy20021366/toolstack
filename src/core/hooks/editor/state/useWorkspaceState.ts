import { useMemo } from "react";
import useTsState, { IUseTsStateOptions } from "../../useTsState";
import { makeWorkspaceKey } from "../../../manager/state-manager";

export default function useWorkspaceState<T>(
  stateName: string,
  defaultValue: T,
) {
  const tsStateOptions = useMemo((): IUseTsStateOptions<T> => {
    const key = makeWorkspaceKey(stateName);
    return {
      key: key,
      defaultValue: defaultValue,
    };
  }, [defaultValue, stateName]);
  const rs = useTsState(tsStateOptions);
  return rs;
}
