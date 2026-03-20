/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useState } from "react";
import { GraphicEditorContext } from "./GraphicEditorContext";
import { getUID } from "../utils/uid-util";
import useTsContext from "../hooks/useTsContext";
import {
  captureElement,
  exportGraphic,
  getStateManagerSerializeData,
} from "./data";
import {
  CTsComponentManager,
  IGraphicComponent,
  IGraphicComponentData,
} from "../manager/component-manager";
import { ACCESSORS } from "./getter";

interface IProps {
  children?: React.ReactNode;
  cid?: string;
}

export default function GraphicEditorContextProvider({
  children,
  cid,
}: IProps) {
  const [isNew, setIsNew] = useState<boolean>(!cid || cid === "new");
  const [controlCid, setControlCid] = useState<string>(
    !cid || cid === "new" ? getUID() : cid,
  );
  const { stateManager } = useTsContext();
  const [isReady, setIsReady] = useState<boolean>(true);

  const load = useCallback(
    (storageKey: string) => {
      const data = localStorage.getItem(storageKey);
      if (data != null) {
        setIsReady(() => false);
        const graphicComponent = JSON.parse(data) as IGraphicComponent;
        setControlCid(graphicComponent.cid);
        setIsNew(false);
        const stateManagerSerializeData = getStateManagerSerializeData(
          graphicComponent.data,
        );
        stateManager.deserialize(stateManagerSerializeData);
        Promise.resolve().then(() => {
          setIsReady(true);
        });
      }
    },
    [stateManager],
  );

  const save = useCallback(() => {
    const graphicData = exportGraphic(stateManager, controlCid);
    if (graphicData == null) {
      return;
    }
    const workspaceName =
      ACCESSORS(stateManager).workspace.info.name.get() ?? "No title";
    const data: IGraphicComponent = {
      cid: controlCid,
      name: workspaceName,
      description: "",
      image: "",
      time: Date.now(),
      data: graphicData,
    };
    localStorage.setItem(`@graphic.${controlCid}`, JSON.stringify(data));
  }, [controlCid, stateManager]);

  const addGraphic = useCallback(
    (data: IGraphicComponentData, parentCid?: string | null) => {
      const ACCESSOR = ACCESSORS(stateManager);
      // The first graphic
      const currentData = ACCESSOR.component(controlCid).data.get();
      if (currentData == null) {
        data.cid = controlCid;
        parentCid = null;
      }

      const COMPONENT = ACCESSOR.component(data.cid);
      const COMPONENT_STATE = COMPONENT.state;
      // Component layout: data, layout, parent, children
      COMPONENT.data.set(data);
      COMPONENT.data.layout.set(data.layout);
      COMPONENT.data.nativeCid.set(data.nativeCid);
      COMPONENT.data.classes.set(data.classes);
      COMPONENT.data.visible.set(data.visible);
      COMPONENT.data.parent.set(parentCid);

      for (const child of data.children) {
        addGraphic(child, data.cid);
      }
      if (parentCid) {
        const children = data.children.map((child) => child.cid);
        COMPONENT.data.children.set(children);
        const parentChildren =
          ACCESSOR.component(parentCid).data.children.get() ?? [];
        ACCESSOR.component(parentCid).data.children.set([
          ...parentChildren,
          data.cid,
        ]);
      } else {
        ACCESSOR.workspace.temp.selectedCid.set(data.cid);
      }

      // Component state value, state in, state out
      for (const { key, stateIn, stateOut, value } of Object.values(
        data.state,
      )) {
        const componentStateKey = COMPONENT_STATE(key);
        if (value !== undefined) {
          componentStateKey.value.set(value);
        }
        if (stateIn != null && typeof stateIn === "string") {
          componentStateKey.in.set(stateIn);
        }
        if (stateOut != null && typeof stateOut === "string") {
          componentStateKey.out.set(stateOut);
        }
      }
    },
    [controlCid, stateManager],
  );

  const deleteGraphic = useCallback(
    (cid: string) => {
      const ACCESSOR = ACCESSORS(stateManager);
      const COMPONENT_LAYOUT = ACCESSOR.component(cid);
      COMPONENT_LAYOUT.data.set(undefined);
      COMPONENT_LAYOUT.data.layout.set(undefined);
      COMPONENT_LAYOUT.data.name.set(undefined);
      COMPONENT_LAYOUT.data.children.set(undefined);
      COMPONENT_LAYOUT.data.nativeCid.set(undefined);

      const parentCid = COMPONENT_LAYOUT.data.parent.get();
      COMPONENT_LAYOUT.data.parent.set(undefined);
      if (parentCid) {
        const PARENT_COMPONENT_LAYOUT = ACCESSOR.component(parentCid);
        const parentChildren =
          PARENT_COMPONENT_LAYOUT.data.children.get() ?? [];
        PARENT_COMPONENT_LAYOUT.data.children.set(
          parentChildren.filter((id) => id !== cid),
        );
      }
      COMPONENT_LAYOUT.data.parent.set(undefined);

      const selectedCid = ACCESSOR.workspace.temp.selectedCid.get();
      if (selectedCid === cid) {
        ACCESSOR.workspace.temp.selectedCid.set(undefined);
      }
    },
    [stateManager],
  );

  const exportGraphicPiece = useCallback(
    (cid: string) => {
      const data = exportGraphic(stateManager, cid);
      if (data == null) {
        return;
      }
      captureElement(`#${cid}`).then((base64) => {
        if (base64) {
          const component: IGraphicComponent = {
            cid: data.cid,
            data: data,
            description: "",
            name: getUID(),
            time: Date.now(),
            image: base64,
          };
          CTsComponentManager.instance.registerGraphicComponent(component);
        }
      });
    },
    [stateManager],
  );

  return (
    <GraphicEditorContext.Provider
      value={{
        cid: controlCid,
        isNew: isNew,
        load: load,
        save: save,
        addGraphic: addGraphic,
        deleteGraphic: deleteGraphic,
        exportGraphicPiece: exportGraphicPiece,
      }}
    >
      {isReady && children}
    </GraphicEditorContext.Provider>
  );
}
