import {
  EditorStateManager,
  ISetValueEventData,
  makeEditorExternalKey,
  stateManagerEvent,
} from "@contexts/editor";
import useApplicationContext from "@hooks/common/useApplicationContext";
import { useCallback, useEffect } from "react";

export default function useGraphicExternalSync(
  editorStateManager: EditorStateManager,
) {
  const { stateManager } = useApplicationContext();
  useEffect(() => {
    editorStateManager.parent = stateManager;
    stateManager.addListener(
      stateManagerEvent.INNER_SET_VALUE_ANY,
      (event: ISetValueEventData) => {
        editorStateManager.setValue(
          makeEditorExternalKey(event.key),
          event.newValue,
          event.options,
        );
      },
    );
  }, [editorStateManager, stateManager]);

  const synch = useCallback(() => {
    editorStateManager.syncWithParent(stateManager);
  }, [editorStateManager, stateManager]);

  return {
    synch: synch,
  };
}
