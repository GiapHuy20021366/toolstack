import { useMemo } from "react";
import useTsState, { IUseTsStateOptions } from "../../useTsState";
import { makeGraphicKey } from "../../../manager/state-manager";

export interface IUseGraphicStateOptions<T = unknown> {
  cid: string;
  stateName: string;
  defaultValue: T;
}

export default function useGraphicState<T>(
  cid: string,
  stateName: string,
  defaultValue: T,
) {
  const tsStateOptions = useMemo((): IUseTsStateOptions<T> => {
    const key = makeGraphicKey(cid, stateName);
    return {
      key: key,
      defaultValue: defaultValue,
    };
  }, [cid, defaultValue, stateName]);
  const rs = useTsState(tsStateOptions);
  return rs;
}
