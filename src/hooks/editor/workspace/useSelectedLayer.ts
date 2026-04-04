import { useCallback, useEffect, useState } from "react";
import useEditorStateContext from "../useEditorStateContext";
import useWorkspaceState from "../state/useWorkspaceState";
import { ACCESSORS } from "@data/editor";

export default function useSelectedLayer() {
  const [selectedLayer, setSelectedLayer] = useWorkspaceState(
    "temp.selected-layer",
    "",
  );
  const { stateManager } = useEditorStateContext();
  const [visibleGraphics, setVisibleGraphics] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedLayer) {
      setVisibleGraphics([]);
      return;
    }

    const ACC = ACCESSORS(stateManager);
    const visibleGraphics: string[] = [selectedLayer];
    let cid = selectedLayer;
    while (cid) {
      const parent = ACC.component(cid).data.parent.get();
      if (parent == null) {
        break;
      } else {
        cid = parent;
        visibleGraphics.push(parent);
      }
    }
    setVisibleGraphics(visibleGraphics);
  }, [selectedLayer, stateManager]);

  const isVisibleBySelectedLayer = useCallback(
    (cid: string, inLayer: boolean, visible: boolean) => {
      if (visibleGraphics.length === 0) {
        return visible;
      }
      if (visibleGraphics.includes(cid)) {
        return true;
      }
      if (inLayer) {
        return visible;
      }
      return false;
    },
    [visibleGraphics],
  );

  return {
    selectedLayer: selectedLayer,
    setSelectedLayer: setSelectedLayer,
    visibleGraphics: visibleGraphics,
    isVisibleBySelectedLayer: isVisibleBySelectedLayer,
  };
}
