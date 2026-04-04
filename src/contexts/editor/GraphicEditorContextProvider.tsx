/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState } from "react";
import { GraphicEditorContext } from "./GraphicEditorContext";
import { getUID } from "@utils";
import { useEditorStateContext, useGraphicExternalSync } from "@hooks/editor";
import { captureElement, exportGraphic, ACCESSORS } from "@data/editor";
import {
  CTsComponentManager,
  IGraphicComponent,
  IGraphicComponentData,
} from "./component-manager";

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
  const { stateManager } = useEditorStateContext();
  const [isReady, setIsReady] = useState<boolean>(true);

  // Sync the external state
  const { synch } = useGraphicExternalSync(stateManager);

  const save = useCallback(() => {
    const graphicData = exportGraphic(stateManager, controlCid);
    if (graphicData == null) {
      return;
    }
    captureElement(`#graphic-area`).then((base64) => {
      if (base64) {
        const workspaceName =
          ACCESSORS(stateManager).workspace.info.name.get() ?? "No title";
        const data: IGraphicComponent = {
          cid: controlCid,
          name: workspaceName,
          description: graphicData.description,
          image: base64,
          time: Date.now(),
          data: graphicData,
        };
        window.graphicComponentsStoreAPI.graphics.save(data);
      }
    });
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

      // Graphic data
      const COMPONENT = ACCESSOR.component(data.cid);
      COMPONENT.data.set(data);
      COMPONENT.data.children.set([]);
      COMPONENT.data.parent.set(parentCid ?? undefined);
      // Graphic state
      COMPONENT.loadState(data.state);

      // Handle child component
      for (const child of data.children) {
        addGraphic(child, data.cid);
      }

      // Workspace select
      if (parentCid) {
        const parentChildren =
          ACCESSOR.component(parentCid).data.children.get() ?? [];
        ACCESSOR.component(parentCid).data.children.set([
          ...parentChildren,
          data.cid,
        ]);
      } else {
        ACCESSOR.workspace.temp.selectedCid.set(data.cid);
      }
    },
    [controlCid, stateManager],
  );

  const load = useCallback(
    async (cid: string) => {
      const data = await window.graphicComponentsStoreAPI.graphics.get(cid);
      if (data != null) {
        setIsReady(() => false);
        setIsNew(false);
        setControlCid(data.cid);

        stateManager.reset();
        // Sync with parent state manager if exists
        synch();

        // Add graphic data to state manager
        addGraphic(data.data, null);

        // Update workspace info
        const ACC_WORKSPACE = ACCESSORS(stateManager).workspace;
        ACC_WORKSPACE.info.cid.set(data.cid);
        ACC_WORKSPACE.info.description.set(data.description);
        ACC_WORKSPACE.info.image.set(data.image);
        ACC_WORKSPACE.info.name.set(data.name);
        ACC_WORKSPACE.info.time.set(data.time);

        Promise.resolve().then(() => {
          setIsReady(true);
        });
      }
    },
    [addGraphic, stateManager, synch],
  );

  const deleteGraphic = useCallback(
    (cid: string) => {
      const ACCESSOR = ACCESSORS(stateManager);
      const COMPONENT_ACC = ACCESSOR.component(cid);

      // Update the parent children
      const parentCid = COMPONENT_ACC.data.parent.get();
      if (parentCid) {
        const PARENT_COMPONENT_LAYOUT = ACCESSOR.component(parentCid);
        const parentChildren =
          PARENT_COMPONENT_LAYOUT.data.children.get() ?? [];
        PARENT_COMPONENT_LAYOUT.data.children.set(
          parentChildren.filter((id) => id !== cid),
        );
      }

      // Delete the component
      COMPONENT_ACC.delete();

      // Update workspace selected
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
            cid: getUID(),
            data: data,
            description: "",
            name: data.name || "",
            time: Date.now(),
            image: base64,
          };
          CTsComponentManager.instance.registerGraphicComponent(component);
        }
      });
    },
    [stateManager],
  );

  /**
   * Bring component far to user
   */
  const bringComponentToBack = useCallback(
    (cid: string) => {
      const ACC = ACCESSORS(stateManager);
      const parent = ACC.component(cid).data.parent.get();
      if (parent != null) {
        const parentChildrenAcc = ACC.component(parent).data.children;
        const parentChildren = parentChildrenAcc.get();
        if (parentChildren != null) {
          const idx = parentChildren.indexOf(cid);
          if (idx > 0) {
            const newChildren = [...parentChildren];
            newChildren[idx] = parentChildren[idx - 1];
            newChildren[idx - 1] = parentChildren[idx];
            parentChildrenAcc.set(newChildren);
          }
        }
      }
    },
    [stateManager],
  );

  /**
   * Bring component close to user
   */
  const bringComponentToFront = useCallback(
    (cid: string) => {
      const ACC = ACCESSORS(stateManager);
      const parent = ACC.component(cid).data.parent.get();
      if (parent != null) {
        const parentChildrenAcc = ACC.component(parent).data.children;
        const parentChildren = parentChildrenAcc.get();
        if (parentChildren != null) {
          const idx = parentChildren.indexOf(cid);
          if (idx < parentChildren.length - 1) {
            const newChildren = [...parentChildren];
            newChildren[idx] = parentChildren[idx + 1];
            newChildren[idx + 1] = parentChildren[idx];
            parentChildrenAcc.set(newChildren);
          }
        }
      }
    },
    [stateManager],
  );

  // Preload
  useEffect(() => {
    load(controlCid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlCid]);

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
        bringComponentToFront: bringComponentToFront,
        bringComponentToBack: bringComponentToBack,
      }}
    >
      {isReady && children}
    </GraphicEditorContext.Provider>
  );
}
