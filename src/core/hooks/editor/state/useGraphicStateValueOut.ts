import { useMemo } from "react";
import useTsState, { IUseTsStateOptions } from "../../useTsState";
import { makeGraphicStateOutKey } from "../../../manager/state-manager";

export interface IGraphicStateValueOutOptions<T = unknown> {
  cid: string;
  stateName: string;
  defaultValue: T;
}

export default function GraphicStateValueOut<T>(
  cid: string,
  stateName: string,
  defaultValue: T,
) {
  const tsStateOptions = useMemo((): IUseTsStateOptions<T> => {
    const key = makeGraphicStateOutKey(cid, stateName);
    return {
      key: key,
      defaultValue: defaultValue,
    };
  }, [cid, defaultValue, stateName]);
  const rs = useTsState(tsStateOptions);
  return rs;
}
