import { useMemo } from "react";
import useManageState, { IUseManageStateOptions } from "../useEditorState";
import { makeEditorGraphicStateKey } from "@contexts/editor";

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
  const tsStateOptions = useMemo((): IUseManageStateOptions<T> => {
    const key = makeEditorGraphicStateKey(cid, stateName);
    return {
      key: key,
      defaultValue: defaultValue,
    };
  }, [cid, defaultValue, stateName]);
  const rs = useManageState(tsStateOptions);
  return rs;
}
