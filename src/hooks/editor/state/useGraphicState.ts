import { useMemo } from "react";
import useManageState, { IUseManageStateOptions } from "../useEditorState";
import { makeEditorGraphicKey } from "@contexts/editor";

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
  const tsStateOptions = useMemo((): IUseManageStateOptions<T> => {
    const key = makeEditorGraphicKey(cid, stateName);
    return {
      key: key,
      defaultValue: defaultValue,
    };
  }, [cid, defaultValue, stateName]);
  const rs = useManageState(tsStateOptions);
  return rs;
}
