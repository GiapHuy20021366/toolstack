import { useMemo } from "react";
import useManageState, { IUseManageStateOptions } from "../useEditorState";
import { makeEditorGlobalKey } from "@contexts/editor";

export default function useGlobalState<T>(stateName: string, defaultValue: T) {
  const tsStateOptions = useMemo((): IUseManageStateOptions<T> => {
    const key = makeEditorGlobalKey(stateName);
    return {
      key: key,
      defaultValue: defaultValue,
    };
  }, [defaultValue, stateName]);
  const rs = useManageState(tsStateOptions);
  return rs;
}
