import { useMemo } from "react";
import useManageState, { IUseManageStateOptions } from "../useEditorState";
import { makeEditorGraphicStateInKey } from "@contexts/editor";

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
  const tsStateOptions = useMemo((): IUseManageStateOptions<T> => {
    const key = makeEditorGraphicStateInKey(cid, stateName);
    return {
      key: key,
      defaultValue: defaultValue,
    };
  }, [cid, defaultValue, stateName]);
  const rs = useManageState(tsStateOptions);
  return rs;
}
