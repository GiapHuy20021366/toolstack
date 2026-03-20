import { useMemo } from "react";
import useTsState, { IUseTsStateOptions } from "../../useTsState";
import { makeGlobalKey } from "../../../manager/state-manager";

export default function useStateGlobal<T>(stateName: string, defaultValue: T) {
  const tsStateOptions = useMemo((): IUseTsStateOptions<T> => {
    const key = makeGlobalKey(stateName);
    return {
      key: key,
      defaultValue: defaultValue,
    };
  }, [defaultValue, stateName]);
  const rs = useTsState(tsStateOptions);
  return rs;
}
