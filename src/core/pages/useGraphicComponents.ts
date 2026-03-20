import { useEffect, useState } from "react";
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

  return {
    nativeComponents: nativeComponents,
    graphicComponents: graphicComponents,
  };
}
