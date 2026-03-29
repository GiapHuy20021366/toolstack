import { StateHandler } from "./state-handle";
import { EStateManagerTag } from "./state-manager";
import { ISetValueEventData, TsVariableManagerEvent } from "./variable-manager";


export class IdentifyStateHandler extends StateHandler {
    // Mapping from data.name -> List cid of components
    private graphicNameMap: Map<string, string[]> = new Map();

    public reset(): void {
        this.graphicNameMap = new Map();
    }

    public load(): void {
        for (const [key, value] of this.parent.keyValueMap.entries()) {
            const [tag, cid] = key.split(".");
            if (tag === EStateManagerTag.GRAPHIC && key.endsWith("data.name")) {
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
            TsVariableManagerEvent.INNER_SET_VALUE_ANY,
            (data: ISetValueEventData) => {
                const { key, oldValue, newValue } = data as ISetValueEventData<string>;
                const [tag, cid] = key.split(".");

                if (tag === EStateManagerTag.GRAPHIC && key.endsWith("data.name")) {
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
                    }
                }
            })
    }

    public getComponentCids(name: string) {
        return this.graphicNameMap.get(name);
    }
}