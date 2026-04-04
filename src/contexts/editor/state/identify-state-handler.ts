import { EditorStateHandler } from "./editor-state-handler";
import { EEditorStateManagerTag, editorStateManagerEvent } from "./editor-state-manager";
import { ISetValueEventData, stateManagerEvent } from "../../common/state-manager";


export class IdentifyStateHandler extends EditorStateHandler {
    // Mapping from data.name -> List cid of components
    private graphicNameMap: Map<string, string[]> = new Map();

    public reset(): void {
        this.graphicNameMap = new Map();
    }

    public load(): void {
        for (const [key, value] of this.parent.keyValueMap.entries()) {
            const [tag, cid] = key.split(".");
            if (tag === EEditorStateManagerTag.GRAPHIC && key.endsWith("data.name")) {
                if (typeof value === "string" && value !== "") {
                    const cids = this.graphicNameMap.get(value) ?? [];
                    cids.push(cid);
                    this.graphicNameMap.set(value, cids);
                }
            }
        }
    }

    protected init(): void {
        this.handleUpdateGraphicNameMap();
    }


    private handleUpdateGraphicNameMap() {
        const parent = this.parent;
        parent.addListener(
            stateManagerEvent.INNER_SET_VALUE_ANY,
            (data: ISetValueEventData) => {
                const { key, oldValue, newValue } = data as ISetValueEventData<string>;
                const [tag, cid] = key.split(".");

                if (tag === EEditorStateManagerTag.GRAPHIC && key.endsWith("data.name")) {
                    // Remove map of old value
                    if (oldValue != null && oldValue !== "") {
                        const oldCids = this.graphicNameMap.get(oldValue);
                        if (oldCids != null) {
                            this.graphicNameMap.set(oldValue, oldCids.filter(oldCid => oldCid !== cid));
                        }
                    }

                    // Add map of new value
                    if (newValue != null && newValue !== "") {
                        const newCids = this.graphicNameMap.get(newValue) ?? [];
                        newCids.push(cid);
                        this.graphicNameMap.set(newValue, newCids);

                        parent.emit(editorStateManagerEvent.SET_GRAPHIC_NAME, data);
                    }
                }
            })
    }

    public getComponentCids(name: string) {
        return this.graphicNameMap.get(name);
    }
}