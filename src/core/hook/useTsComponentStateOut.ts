import { useMemo } from "react";
import { makeComponentStateOutKey } from "../manager/state-manager";
import useTsState, { IUseTsStateOptions } from "./useTsState";

export interface IUseTsComponentStateOutOptions<T = unknown> {
  cid: string;
  stateName: string;
  defaultValue: T;
}

export default function useTsComponentStateOut<T>(
  cid: string,
  stateName: string,
  defaultValue: T,
) {
  const tsStateOptions = useMemo((): IUseTsStateOptions<T> => {
    const key = makeComponentStateOutKey(cid, stateName);
    return {
      key: key,
      defaultValue: defaultValue,
    };
  }, [cid, defaultValue, stateName]);
  const rs = useTsState(tsStateOptions);
  return rs;
}
