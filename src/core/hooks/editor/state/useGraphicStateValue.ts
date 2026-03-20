import { useMemo } from "react";
import useTsState, { IUseTsStateOptions } from "../../useTsState";
import { makeGraphicStateKey } from "../../../manager/state-manager";

export interface IUseGraphicStateValueOptions<T = unknown> {
  cid: string;
  stateName: string;
  defaultValue: T;
}

export default function useGraphicStateValue<T>(
  cid: string,
  stateName: string,
  defaultValue: T,
) {
  const tsStateOptions = useMemo((): IUseTsStateOptions<T> => {
    const key = makeGraphicStateKey(cid, stateName);
    return {
      key: key,
      defaultValue: defaultValue,
    };
  }, [cid, defaultValue, stateName]);
  const rs = useTsState(tsStateOptions);
  return rs;
}
