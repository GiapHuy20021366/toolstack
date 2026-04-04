import {
    EditorStateManager,
    EEditorStateManagerTag,
    IGraphicComponentData,
    IGraphicComponentState,
    ILayoutBounds,
    makeEditorGlobalKey,
    makeEditorGraphicKey,
    makeEditorGraphicStateInKey,
    makeEditorGraphicStateKey,
    makeEditorGraphicStateOutKey,
    makeEditorStateManagerKey,
    makeEditorWorkspaceKey
} from "@contexts/editor";
import { CSSProperties } from "react";

/**
 * The data getter/setter for graphic editor
 * @param stateManager 
 * @returns 
 */
export const ACCESSORS = (stateManager: EditorStateManager) => ({
    component: (cid: string) => ({
        /**
         * Delete the component
         */
        delete: () => {
            const ACC_COMPONENT = ACCESSORS(stateManager).component(cid);
            const children = ACC_COMPONENT.data.children.get() ?? [];
            const stateDict = ACC_COMPONENT.getStateDict();

            // Delete state, state in, state out
            for (const key of Object.keys(stateDict)) {
                ACC_COMPONENT.state(key).value.delete();
                ACC_COMPONENT.state(key).in.delete();
                ACC_COMPONENT.state(key).out.delete();
            }

            // Delete graphic data
            ACC_COMPONENT.data.delete();

            // Delete children graphic data
            for (const child of children) {
                const CHILD_ACC_COMPONENT = ACCESSORS(stateManager).component(child);
                CHILD_ACC_COMPONENT.delete();
            }
        },

        /**
         * Graphic data access
         */
        data: {
            get: () => {
                return stateManager.getValue<IGraphicComponentData>(
                    makeEditorGraphicKey(cid, "data"),
                );
            },
            set: (value: IGraphicComponentData) => {
                // Set the data
                stateManager.setValue(makeEditorGraphicKey(cid, "data"), value);

                // Set the inner data
                const ACC_COMPONENT_DATA = ACCESSORS(stateManager).component(cid).data;
                ACC_COMPONENT_DATA.cid.set(value.cid);
                ACC_COMPONENT_DATA.name.set(value.name);
                ACC_COMPONENT_DATA.nativeCid.set(value.nativeCid);
                ACC_COMPONENT_DATA.description.set(value.description);
                ACC_COMPONENT_DATA.layout.set(value.layout);
                ACC_COMPONENT_DATA.visible.set(value.visible);
                ACC_COMPONENT_DATA.classes.set(value.classes);
                ACC_COMPONENT_DATA.style.set(value.style ?? {});
                // ACC_COMPONENT_DATA.children.set(value.children.map(child => child.cid));
            },
            delete: () => {
                // Remove data
                stateManager.setValue(makeEditorGraphicKey(cid, "data"), undefined);

                // Remove inner data
                const ACC_COMPONENT_DATA = ACCESSORS(stateManager).component(cid).data;
                ACC_COMPONENT_DATA.cid.delete();
                ACC_COMPONENT_DATA.name.delete();
                ACC_COMPONENT_DATA.nativeCid.delete();
                ACC_COMPONENT_DATA.description.delete();
                ACC_COMPONENT_DATA.layout.delete();
                ACC_COMPONENT_DATA.children.delete();
                ACC_COMPONENT_DATA.parent.delete();
                ACC_COMPONENT_DATA.visible.delete();
                ACC_COMPONENT_DATA.classes.delete();
                ACC_COMPONENT_DATA.style.delete();
            },
            key: makeEditorGraphicKey(cid, "data"),

            // Cid
            cid: {
                get: () => {
                    return stateManager.getValue<string>(makeEditorGraphicKey(cid, "data.cid"));
                },
                set: (value: string) => {
                    return stateManager.setValue(makeEditorGraphicKey(cid, "data.cid"), value);
                },
                delete: () => {
                    return stateManager.setValue(makeEditorGraphicKey(cid, "data.cid"), undefined);
                },
                key: makeEditorGraphicKey(cid, "data.cid")
            },

            // Name
            name: {
                get: () => {
                    return stateManager.getValue<string>(
                        makeEditorGraphicKey(cid, "data.name"),
                    );
                },
                set: (value: string) => {
                    return stateManager.setValue(makeEditorGraphicKey(cid, "data.name"), value);
                },
                delete: () => {
                    return stateManager.setValue(makeEditorGraphicKey(cid, "data.name"), undefined);
                },
                key: makeEditorGraphicKey(cid, "data.name")
            },

            // NativeCid
            nativeCid: {
                get: () => {
                    return stateManager.getValue<string>(
                        makeEditorGraphicKey(cid, "data.native-cid"),
                    );
                },
                set: (value?: string) => {
                    return stateManager.setValue(
                        makeEditorGraphicKey(cid, "data.native-cid"),
                        value,
                    );
                },
                delete: () => {
                    return stateManager.setValue(makeEditorGraphicKey(cid, "data.native-cid"), undefined);
                },
                key: makeEditorGraphicKey(cid, "data.native-cid")
            },

            // Description
            description: {
                get: () => {
                    return stateManager.getValue<string>(
                        makeEditorGraphicKey(cid, "data.description"),
                    );
                },
                set: (value: string) => {
                    return stateManager.setValue(
                        makeEditorGraphicKey(cid, "data.description"),
                        value,
                    );
                },
                delete: () => {
                    return stateManager.setValue(makeEditorGraphicKey(cid, "data.description"), undefined);
                },
                key: makeEditorGraphicKey(cid, "data.description")
            },

            // Layout
            layout: {
                get: () => {
                    return stateManager.getValue<ILayoutBounds>(
                        makeEditorGraphicKey(cid, "data.layout"),
                    );
                },
                set: (value: ILayoutBounds) => {
                    const ACC_COMPONENT_DATA_LAYOUT = ACCESSORS(stateManager).component(cid).data.layout;
                    ACC_COMPONENT_DATA_LAYOUT.x.set(value.x);
                    ACC_COMPONENT_DATA_LAYOUT.y.set(value.y);
                    ACC_COMPONENT_DATA_LAYOUT.width.set(value.width);
                    ACC_COMPONENT_DATA_LAYOUT.height.set(value.height);
                    return stateManager.setValue(
                        makeEditorGraphicKey(cid, "data.layout"),
                        value,
                    );
                },
                delete: () => {
                    return stateManager.setValue(makeEditorGraphicKey(cid, "data.layout"), undefined);
                },
                key: makeEditorGraphicKey(cid, "data.layout"),

                x: {
                    get: () => {
                        return stateManager.getValue<number>(
                            makeEditorGraphicKey(cid, "data.layout.x"),
                        );
                    },
                    set: (value: number) => {
                        return stateManager.setValue(
                            makeEditorGraphicKey(cid, "data.layout.x"),
                            value,
                        );
                    },
                    key: makeEditorGraphicKey(cid, "data.layout.x")
                },
                y: {
                    get: () => {
                        return stateManager.getValue<number>(
                            makeEditorGraphicKey(cid, "data.layout.y"),
                        );
                    },
                    set: (value: number) => {
                        return stateManager.setValue(
                            makeEditorGraphicKey(cid, "data.layout.y"),
                            value,
                        );
                    },
                    key: makeEditorGraphicKey(cid, "data.layout.y")
                },
                width: {
                    get: () => {
                        return stateManager.getValue<number>(
                            makeEditorGraphicKey(cid, "data.layout.width"),
                        );
                    },
                    set: (value: number) => {
                        return stateManager.setValue(
                            makeEditorGraphicKey(cid, "data.layout.width"),
                            value,
                        );
                    },
                    key: makeEditorGraphicKey(cid, "data.layout.width")
                },
                height: {
                    get: () => {
                        return stateManager.getValue<number>(
                            makeEditorGraphicKey(cid, "data.layout.height"),
                        );
                    },
                    set: (value: number) => {
                        return stateManager.setValue(
                            makeEditorGraphicKey(cid, "data.layout.height"),
                            value,
                        );
                    },
                    key: makeEditorGraphicKey(cid, "data.layout.height")
                }
            },

            // Children
            children: {
                get: () => {
                    return stateManager.getValue<string[]>(
                        makeEditorGraphicKey(cid, "data.children"),
                    );
                },
                set: (value: string[]) => {
                    return stateManager.setValue(
                        makeEditorGraphicKey(cid, "data.children"),
                        value,
                    );
                },
                delete: () => {
                    return stateManager.setValue(makeEditorGraphicKey(cid, "data.children"), undefined);
                },
                key: makeEditorGraphicKey(cid, "data.children")
            },

            parent: {
                get: () => {
                    return stateManager.getValue<string>(
                        makeEditorGraphicKey(cid, "data.parent"),
                    );
                },
                set: (value?: string) => {
                    return stateManager.setValue(
                        makeEditorGraphicKey(cid, "data.parent"),
                        value,
                    );
                },
                delete: () => {
                    return stateManager.setValue(makeEditorGraphicKey(cid, "data.parent"), undefined);
                },
                key: makeEditorGraphicKey(cid, "data.parent")
            },

            // Visible
            visible: {
                get: () => {
                    return stateManager.getValue<boolean>(
                        makeEditorGraphicKey(cid, "data.visible"),
                    );
                },
                set: (value: boolean) => {
                    return stateManager.setValue(
                        makeEditorGraphicKey(cid, "data.visible"),
                        value,
                    );
                },
                delete: () => {
                    return stateManager.setValue(makeEditorGraphicKey(cid, "data.visible"), undefined);
                },
                key: makeEditorGraphicKey(cid, "data.visible")
            },

            // Classes
            classes: {
                get: () => {
                    return stateManager.getValue<string>(
                        makeEditorGraphicKey(cid, "data.classes"),
                    );
                },
                set: (value: string) => {
                    return stateManager.setValue(
                        makeEditorGraphicKey(cid, "data.classes"),
                        value,
                    );
                },
                delete: () => {
                    return stateManager.setValue(makeEditorGraphicKey(cid, "data.classes"), undefined);
                },
                key: makeEditorGraphicKey(cid, "data.classes")
            },

            // Style
            style: {
                get: () => {
                    return stateManager.getValue<CSSProperties>(
                        makeEditorGraphicKey(cid, "data.style"),
                    );
                },
                set: (value: CSSProperties) => {
                    return stateManager.setValue(
                        makeEditorGraphicKey(cid, "data.style"),
                        value,
                    );
                },
                delete: () => {
                    return stateManager.setValue(makeEditorGraphicKey(cid, "data.style"), undefined);
                },
                key: makeEditorGraphicKey(cid, "data.style")
            },

            // Others
        },

        /**
         * Load the state data
         * @param state 
         */
        loadState: (state: IGraphicComponentState) => {
            const ACC_COMPONENT = ACCESSORS(stateManager).component(cid);
            for (const { key, stateIn, stateOut, value } of Object.values(
                state,
            )) {
                const stateAcc = ACC_COMPONENT.state(key);
                stateAcc.value.set(value);
                stateAcc.in.set(stateIn);
                stateAcc.out.set(stateOut);
            }
        },

        /**
         * Graphic state access
         * @param stateName 
         * @returns 
         */
        state: (stateName: string) => {
            return {
                value: {
                    get: () => {
                        return stateManager.getValue(makeEditorGraphicStateKey(cid, stateName));
                    },
                    set: (value: unknown) => {
                        return stateManager.setValue(
                            makeEditorGraphicStateKey(cid, stateName),
                            value,
                        );
                    },
                    delete: () => {
                        return stateManager.setValue(
                            makeEditorGraphicStateKey(cid, stateName),
                            undefined,
                        );
                    }
                },
                in: {
                    get: () => {
                        return stateManager.getValue(makeEditorGraphicStateInKey(cid, stateName));
                    },
                    set: (value: unknown) => {
                        return stateManager.setValue(
                            makeEditorGraphicStateInKey(cid, stateName),
                            value,
                        );
                    },
                    delete: () => {
                        return stateManager.setValue(
                            makeEditorGraphicStateInKey(cid, stateName),
                            undefined,
                        );
                    }
                },
                out: {
                    get: () => {
                        return stateManager.getValue(
                            makeEditorGraphicStateOutKey(cid, stateName),
                        );
                    },
                    set: (value: unknown) => {
                        return stateManager.setValue(
                            makeEditorGraphicStateOutKey(cid, stateName),
                            value,
                        );
                    },
                    delete: () => {
                        return stateManager.setValue(
                            makeEditorGraphicStateOutKey(cid, stateName),
                            undefined,
                        );
                    }
                },
            };
        },

        /**
         * Get the state dictionary of component
         * @returns 
         */
        getStateDict: (extractor?: (key: string) => string) => {
            return stateManager.getStateDictionaryBySelector(
                (key) =>
                    key.startsWith(makeEditorStateManagerKey(EEditorStateManagerTag.STATE, cid)) &&
                    key.endsWith(".value"),
                extractor ?? ((key) => {
                    const [_tab, _cid, keyName, _subfixText] = key.split(".");
                    return keyName;
                }),
            );
        },
        /**
         * Get the state in dictionary of component
         * @returns 
         */
        getStateInDict: (extractor?: (key: string) => string) => {
            return stateManager.getStateDictionaryBySelector(
                (key) =>
                    key.startsWith(makeEditorStateManagerKey(EEditorStateManagerTag.STATE, cid)) &&
                    key.endsWith(".in"),
                extractor ?? ((key) => {
                    const [_tab, _cid, keyName, _subfixText] = key.split(".");
                    return keyName;
                }),
            );
        },
        /**
         * Get the state out dictionary of component
         * @returns 
         */
        getStateOutDict: (extractor?: (key: string) => string) => {
            return stateManager.getStateDictionaryBySelector(
                (key) =>
                    key.startsWith(makeEditorStateManagerKey(EEditorStateManagerTag.STATE, cid)) &&
                    key.endsWith("out"),
                extractor ?? ((key) => {
                    const [_tab, _cid, keyName, _subfixText] = key.split(".");
                    return keyName;
                }),
            );
        },
    }),

    /**
     * Global value access
     */
    global: {
        state: (stateName: string) => ({
            value: {
                get: () => {
                    return stateManager.getValue(makeEditorGlobalKey(stateName));
                },
                set: (value: unknown) => {
                    return stateManager.setValue(makeEditorGlobalKey(stateName), value);
                },
                delete: () => {
                    return stateManager.setValue(makeEditorGlobalKey(stateName), undefined);
                }
            },
        }),
    },

    /**
     * Workspace access
     */
    workspace: {
        /**
         * Workspace information access
         */
        info: {
            // Cid
            cid: {
                get: () => {
                    return stateManager.getValue<string>(makeEditorWorkspaceKey("info.cid"));
                },
                set: (value: string) => {
                    return stateManager.setValue(makeEditorWorkspaceKey("info.cid"), value);
                },
            },

            // Name
            name: {
                get: () => {
                    return stateManager.getValue<string>(makeEditorWorkspaceKey("info.name"));
                },
                set: (value: string) => {
                    return stateManager.setValue(makeEditorWorkspaceKey("info.name"), value);
                },
            },

            // Description
            description: {
                get: () => {
                    return stateManager.getValue<string>(
                        makeEditorWorkspaceKey("info.description"),
                    );
                },
                set: (value: string) => {
                    return stateManager.setValue(
                        makeEditorWorkspaceKey("info.description"),
                        value,
                    );
                },
            },

            // Image
            image: {
                get: () => {
                    return stateManager.getValue<string>(makeEditorWorkspaceKey("info.image"));
                },
                set: (value: string) => {
                    return stateManager.setValue(makeEditorWorkspaceKey("info.image"), value);
                },
            },

            // Time
            time: {
                get: () => {
                    return stateManager.getValue<number>(makeEditorWorkspaceKey("info.time"));
                },
                set: (value: number) => {
                    return stateManager.setValue(makeEditorWorkspaceKey("info.time"), value);
                },
            },
        },

        /**
         * Workspace temporary access
         */
        temp: {
            selectedCid: {
                get: () => {
                    return stateManager.getValue<string>(
                        makeEditorWorkspaceKey("temp.selected-cid"),
                    );
                },
                set: (value?: string | null) => {
                    return stateManager.setValue(
                        makeEditorWorkspaceKey("temp.selected-cid"),
                        value,
                    );
                },
            },
        },

        /**
         * Workspace layout access
         */
        layout: {
            scale: {
                get: () => {
                    return stateManager.getValue<number>(
                        makeEditorWorkspaceKey("layout.scale"),
                    );
                },
                set: (value: number) => {
                    return stateManager.setValue(makeEditorWorkspaceKey("layout.scale"), value);
                },
            },
            width: {
                get: () => {
                    return stateManager.getValue<number>(
                        makeEditorWorkspaceKey("layout.width"),
                    );
                },
                set: (value: number) => {
                    return stateManager.setValue(makeEditorWorkspaceKey("layout.width"), value);
                },
            },
            height: {
                get: () => {
                    return stateManager.getValue<number>(
                        makeEditorWorkspaceKey("layout.height"),
                    );
                },
                set: (value: number) => {
                    return stateManager.setValue(
                        makeEditorWorkspaceKey("layout.height"),
                        value,
                    );
                },
            },
            resolution: {
                get: () => {
                    return stateManager.getValue<string>(
                        makeEditorWorkspaceKey("layout.resolution"),
                    );
                },
                set: (value: string) => {
                    return stateManager.setValue(
                        makeEditorWorkspaceKey("layout.resolution"),
                        value,
                    );
                },
            },
        },

        /**
         * Workspace mode access
         */
        mode: {
            get: () => {
                return stateManager.getValue<string>(
                    makeEditorWorkspaceKey("mode"),
                );
            },
            set: (value: string) => {
                return stateManager.setValue(
                    makeEditorWorkspaceKey("mode"),
                    value,
                );
            },
        }
    },
}) as const;
