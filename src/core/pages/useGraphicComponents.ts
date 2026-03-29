import { COMPONENT_TAG_INFO_MAP, IComponentTagInfo } from './../manager/component-manager';
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CTsComponentManager,
  IGraphicComponent,
  INativeComponent,
} from "../manager/component-manager";


export default function useGraphicComponents() {
  const [nativeComponents, setNativeComponents] = useState<INativeComponent[]>(
    () => {
      return CTsComponentManager.instance.nativeComponents;
    },
  );
  const [graphicComponents, setGraphicComponents] = useState<
    IGraphicComponent[]
  >(() => {
    return CTsComponentManager.instance.graphicComponents;
  });

  const nativeComponentMap = useMemo(() => {
    const map: Record<IComponentTagInfo["id"], INativeComponent[]> = {};
    for (const component of nativeComponents) {
      (map[COMPONENT_TAG_INFO_MAP[component.tag].id] ??= []).push(component);
    }
    return map;
  }, [nativeComponents]);

  useEffect(() => {
    const event = () => {
      setNativeComponents(CTsComponentManager.instance.nativeComponents);
      setGraphicComponents(CTsComponentManager.instance.graphicComponents);
    };
    CTsComponentManager.instance.addListener("change", event);
    return () => {
      CTsComponentManager.instance.removeListener("change", event);
    };
  }, []);

  const deleteGraphicComponent = useCallback((cid: string) => {
    CTsComponentManager.instance.removeGraphicComponent(cid);
  }, [])

  return {
    nativeComponents: nativeComponents,
    graphicComponents: graphicComponents,
    nativeComponentMap: nativeComponentMap,
    deleteGraphicComponent: deleteGraphicComponent
  };
}
