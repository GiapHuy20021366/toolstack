import { useEffect } from "react";
import useEditorStateContext from "../useEditorStateContext";
import { makeEditorRefKey } from "@contexts/editor";

export interface IGraphicRefRegistrationRef<T> {
  current: T;
}
export default function useGraphicRefRegistration<T>(
  cid: string,
  ref: IGraphicRefRegistrationRef<T>,
) {
  const { stateManager } = useEditorStateContext();
  useEffect(() => {
    const key = makeEditorRefKey(cid);
    stateManager.setValue(key, ref.current);
    return () => {
      stateManager.setValue(key, undefined);
    };
  }, [cid, ref, stateManager]);
}
