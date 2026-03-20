import { useMemo } from "react";
import useTsState, { IUseTsStateOptions } from "../../useTsState";
import { makeGraphicStateInKey } from "../../../manager/state-manager";

export interface IUseGraphicStateValueInOptions<T = unknown> {
  cid: string;
  stateName: string;
  defaultValue: T;
}

export default function useGraphicStateValueIn<T>(
  cid: string,
  stateName: string,
  defaultValue: T,
) {
  const tsStateOptions = useMemo((): IUseTsStateOptions<T> => {
    const key = makeGraphicStateInKey(cid, stateName);
    return {
      key: key,
      defaultValue: defaultValue,
    };
  }, [cid, defaultValue, stateName]);
  const rs = useTsState(tsStateOptions);
  return rs;
}
