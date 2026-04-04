import { useMemo } from "react";
import useManageState, { IUseManageStateOptions } from "../useEditorState";
import { makeEditorGraphicStateOutKey } from "@contexts/editor/";

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
  const tsStateOptions = useMemo((): IUseManageStateOptions<T> => {
    const key = makeEditorGraphicStateOutKey(cid, stateName);
    return {
      key: key,
      defaultValue: defaultValue,
    };
  }, [cid, defaultValue, stateName]);
  const rs = useManageState(tsStateOptions);
  return rs;
}
