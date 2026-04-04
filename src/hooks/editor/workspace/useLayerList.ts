import { useEffect, useState } from "react";
import debounce from "lodash/debounce";
import {
  CTsComponentManager,
  ENativeComponentRole,
  IGraphicComponentData,
} from "@contexts/editor";
import useEditorStateContext from "../useEditorStateContext";
import { ACCESSORS } from "@data/editor";
import useGraphicEditorContext from "../useGraphicEditorContext";

export default function useGraphicLayers(elementId: string) {
  const [layers, setLayers] = useState<IGraphicComponentData[]>([]);
  const { cid } = useGraphicEditorContext();
  const { stateManager } = useEditorStateContext();

  useEffect(() => {
    const target = document.getElementById(elementId);
    if (!target) return;

    const ACC = ACCESSORS(stateManager);
    let layers: IGraphicComponentData[] = [];
    const scan = (componentCid: string) => {
      const DATA = ACC.component(componentCid).data;
      const data = DATA.get();
      const name = DATA.name.get();
      const nativeCid = DATA.nativeCid.get();
      if (data != null && nativeCid != null) {
        const component =
          CTsComponentManager.instance.getNativeComponent(nativeCid);
        if (
          component != null &&
          component.role === ENativeComponentRole.LAYER
        ) {
          data.name = name ?? "";
          layers.push(data);
        }
      }

      const children = ACC.component(componentCid).data.children.get();
      if (children != null) {
        for (const child of children) {
          scan(child);
        }
      }
    };

    const debouncedScan = debounce(() => {
      layers = [];
      scan(cid);
      setLayers(layers);
    }, 1000);

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "childList" || m.type === "attributes") {
          debouncedScan();
          break;
        }
      }
    });

    observer.observe(target, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["layer-cid", "component-role", "component-name"],
    });

    // initial
    scan(cid);

    return () => {
      observer.disconnect();
      debouncedScan.cancel();
    };
  }, [cid, elementId, stateManager]);

  return { layers };
}
