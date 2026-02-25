import { useMemo } from "react";
import { makeComponentStateKey } from "../manager/state-manager";
import useTsState, { IUseTsStateOptions } from "./useTsState";

export interface IUseTsComponentStateOptions<T = unknown> {
  cid: string;
  stateName: string;
  defaultValue: T;
}

export default function useTsComponentState<T>(
  cid: string,
  stateName: string,
  defaultValue: T,
) {
  const tsStateOptions = useMemo((): IUseTsStateOptions<T> => {
    const key = makeComponentStateKey(cid, stateName);
    return {
      key: key,
      defaultValue: defaultValue,
    };
  }, [cid, defaultValue, stateName]);
  const rs = useTsState(tsStateOptions);
  return rs;
}
