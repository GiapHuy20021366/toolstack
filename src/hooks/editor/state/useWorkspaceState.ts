import { useMemo } from "react";
import useManageState, { IUseManageStateOptions } from "../useEditorState";
import { makeEditorWorkspaceKey } from "@contexts/editor";

export default function useWorkspaceState<T>(
  stateName: string,
  defaultValue: T,
) {
  const tsStateOptions = useMemo((): IUseManageStateOptions<T> => {
    const key = makeEditorWorkspaceKey(stateName);
    return {
      key: key,
      defaultValue: defaultValue,
    };
  }, [defaultValue, stateName]);
  const rs = useManageState(tsStateOptions);
  return rs;
}
