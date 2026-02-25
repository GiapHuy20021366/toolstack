import { useMemo } from "react";
import { makeComponentStateInKey } from "../manager/state-manager";
import useTsState, { IUseTsStateOptions } from "./useTsState";

export interface IUseTsComponentStateInOptions<T = unknown> {
  cid: string;
  stateName: string;
  defaultValue: T;
}

export default function useTsComponentStateIn<T>(
  cid: string,
  stateName: string,
  defaultValue: T,
) {
  const tsStateOptions = useMemo((): IUseTsStateOptions<T> => {
    const key = makeComponentStateInKey(cid, stateName);
    return {
      key: key,
      defaultValue: defaultValue,
    };
  }, [cid, defaultValue, stateName]);
  const rs = useTsState(tsStateOptions);
  return rs;
}
