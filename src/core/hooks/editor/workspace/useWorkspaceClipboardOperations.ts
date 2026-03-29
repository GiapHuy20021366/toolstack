import { useCallback, useEffect, useRef } from "react";
import { IGraphicComponent } from "../../../manager/component-manager";
import useTsContext from "../../useTsContext";
import { ACCESSORS } from "../../../pages/getter";
import { cloneGraphicComponent, exportGraphic } from "../../../pages/data";
import useGraphicEditorContext from "../../../pages/useGraphicEditorContext";
import { getRelativeMousePositionByClient } from "../../../pages/gui-helper";

const isTypingElement = (el: EventTarget | null) => {
    if (!(el instanceof HTMLElement)) return false;

    const tag = el.tagName;

    return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        el.isContentEditable
    );
};

export default function useWorkspaceClipboardOperations(areaId: string) {
    const { stateManager } = useTsContext();
    const { deleteGraphic, addGraphic } = useGraphicEditorContext();
    const componentRef = useRef<IGraphicComponent | null>(null);
    const pointerRef = useRef<[number, number]>([0, 0]);

    const handelCopyEvent = useCallback(() => {
        const selectedCid = ACCESSORS(stateManager).workspace.temp.selectedCid.get();
        if (!selectedCid) return;
        const data = exportGraphic(stateManager, selectedCid);
        if (data != null) {
            componentRef.current = {
                cid: data.cid,
                data: data,
                description: data.description,
                image: "",
                name: data.name,
                time: Date.now()
            }
        }
    }, [stateManager]);

    const handelCutEvent = useCallback(() => {
        const selectedCid = ACCESSORS(stateManager).workspace.temp.selectedCid.get();
        if (!selectedCid) return;
        const data = exportGraphic(stateManager, selectedCid);
        if (data != null) {
            componentRef.current = {
                cid: data.cid,
                data: data,
                description: data.description,
                image: "",
                name: data.name,
                time: Date.now()
            }
            deleteGraphic(selectedCid);
        }
    }, [stateManager, deleteGraphic]);

    const handelPasteEvent = useCallback(() => {
        const data = componentRef.current;
        if (data == null) return;

        const pointer = pointerRef.current;
        const el = document.elementFromPoint(pointer[0], pointer[1]);
        if (!el) return;

        const container = el.closest("[container-cid]") as HTMLElement | null;
        if (container == null) return;

        const cid = container.getAttribute("container-cid");
        if (!cid) return;

        const transformed = getRelativeMousePositionByClient(pointer[0], pointer[1], container);
        const cloned = cloneGraphicComponent(data);
        cloned.data.layout = {
            ...cloned.data.layout,
            x: transformed.x,
            y: transformed.y
        };
        addGraphic(cloned.data, cid);
    }, [stateManager, addGraphic]);

    useEffect(() => {
        const element = document.getElementById(areaId);
        if (element == null) {
            return;
        }

        const handleKeyDownEvent = (e: KeyboardEvent) => {
            if (isTypingElement(e.target)) return;
            if (!e.ctrlKey) return;

            switch (e.key.toLowerCase()) {
                case "c":
                    e.preventDefault();
                    handelCopyEvent();
                    break;
                case "v":
                    e.preventDefault();
                    handelPasteEvent();
                    break;
                case "x":
                    e.preventDefault();
                    handelCutEvent();
                    break;
            }
        };

        const handlePointerMove = (e: MouseEvent) => {
            pointerRef.current = [e.clientX, e.clientY];
        }

        element.addEventListener("keydown", handleKeyDownEvent);
        element.addEventListener("pointermove", handlePointerMove);

        return () => {
            element.removeEventListener("keydown", handleKeyDownEvent);
            element.removeEventListener("pointermove", handlePointerMove);
        }
    }, [areaId]);
}