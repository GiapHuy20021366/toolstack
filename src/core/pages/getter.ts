import {
  IGraphicComponentData,
  IGraphicComponentState,
  ILayoutBounds,
} from "../manager/component-manager";
import {
  CTsStateManager,
  EStateManagerTag,
  makeGlobalKey,
  makeGraphicKey,
  makeGraphicStateInKey,
  makeGraphicStateKey,
  makeGraphicStateOutKey,
  makeStateManagerKey,
  makeWorkspaceKey,
} from "../manager/state-manager";

export const ACCESSORS = (stateManager: CTsStateManager) => ({
  component: (cid: string) => ({
    data: {
      get: () => {
        return stateManager.getValue<IGraphicComponentData>(
          makeGraphicKey(cid, "data"),
        );
      },
      set: (value?: IGraphicComponentData) => {
        return stateManager.setValue(makeGraphicKey(cid, "data"), value);
      },
      getKey: () => {
        return makeGraphicKey(cid, "data");
      },

      // Cid
      cid: {
        get: () => {
          return stateManager.getValue<string>(makeGraphicKey(cid, "data.cid"));
        },
        set: (value?: string) => {
          return stateManager.setValue(makeGraphicKey(cid, "data.cid"), value);
        },
      },

      // Name
      name: {
        get: () => {
          return stateManager.getValue<string>(
            makeGraphicKey(cid, "data.name"),
          );
        },
        set: (value?: string) => {
          return stateManager.setValue(makeGraphicKey(cid, "data.name"), value);
        },
      },

      // NativeCid
      nativeCid: {
        get: () => {
          return stateManager.getValue<string>(
            makeGraphicKey(cid, "data.native-cid"),
          );
        },
        set: (value?: string) => {
          return stateManager.setValue(
            makeGraphicKey(cid, "data.native-cid"),
            value,
          );
        },
      },

      // Description
      description: {
        get: () => {
          return stateManager.getValue<string>(
            makeGraphicKey(cid, "data.description"),
          );
        },
        set: (value?: string) => {
          return stateManager.setValue(
            makeGraphicKey(cid, "data.description"),
            value,
          );
        },
      },

      // Layout
      layout: {
        get: () => {
          return stateManager.getValue<ILayoutBounds>(
            makeGraphicKey(cid, "data.layout"),
          );
        },
        set: (value?: ILayoutBounds) => {
          return stateManager.setValue(
            makeGraphicKey(cid, "data.layout"),
            value,
          );
        },
      },

      // Children
      children: {
        get: () => {
          return stateManager.getValue<string[]>(
            makeGraphicKey(cid, "data.children"),
          );
        },
        set: (value?: string[]) => {
          return stateManager.setValue(
            makeGraphicKey(cid, "data.children"),
            value,
          );
        },
      },

      // State
      state: {
        get: () => {
          return stateManager.getValue<IGraphicComponentState>(
            makeGraphicKey(cid, "data.state"),
          );
        },
        set: (value?: IGraphicComponentState) => {
          return stateManager.setValue(
            makeGraphicKey(cid, "data.state"),
            value,
          );
        },
      },

      parent: {
        get: () => {
          return stateManager.getValue<string>(
            makeGraphicKey(cid, "data.parent"),
          );
        },
        set: (value?: string | null) => {
          return stateManager.setValue(
            makeGraphicKey(cid, "data.parent"),
            value,
          );
        },
      },

      // Visible
      visible: {
        get: () => {
          return stateManager.getValue<boolean>(
            makeGraphicKey(cid, "data.visible"),
          );
        },
        set: (value?: boolean) => {
          return stateManager.setValue(
            makeGraphicKey(cid, "data.visible"),
            value,
          );
        },
      },

      // Classes
      classes: {
        get: () => {
          return stateManager.getValue<string>(
            makeGraphicKey(cid, "data.classes"),
          );
        },
        set: (value?: string) => {
          return stateManager.setValue(
            makeGraphicKey(cid, "data.classes"),
            value,
          );
        },
      },

      // Others
    },
    state: (stateName: string) => {
      return {
        value: {
          get: () => {
            return stateManager.getValue(makeGraphicStateKey(cid, stateName));
          },
          set: (value: unknown) => {
            return stateManager.setValue(
              makeGraphicStateKey(cid, stateName),
              value,
            );
          },
          dict: () => {},
        },
        in: {
          get: () => {
            return stateManager.getValue(makeGraphicStateInKey(cid, stateName));
          },
          set: (value: unknown) => {
            return stateManager.setValue(
              makeGraphicStateInKey(cid, stateName),
              value,
            );
          },
        },
        out: {
          get: () => {
            return stateManager.getValue(
              makeGraphicStateOutKey(cid, stateName),
            );
          },
          set: (value: unknown) => {
            return stateManager.setValue(
              makeGraphicStateOutKey(cid, stateName),
              value,
            );
          },
        },
      };
    },

    getStateDict: () => {
      return stateManager.getStateDictionaryBySelector(
        (key) =>
          key.startsWith(makeStateManagerKey(EStateManagerTag.STATE, cid)) &&
          key.endsWith(".value"),
        (key) => {
          const [_tab, _cid, keyName, _subfixText] = key.split(".");
          return keyName;
        },
      );
    },
    getStateInDict: () => {
      return stateManager.getStateDictionaryBySelector(
        (key) =>
          key.startsWith(makeStateManagerKey(EStateManagerTag.STATE, cid)) &&
          key.endsWith(".in"),
        (key) => {
          const [_tab, _cid, keyName, _subfixText] = key.split(".");
          return keyName;
        },
      );
    },
    getStateOutDict: () => {
      return stateManager.getStateDictionaryBySelector(
        (key) =>
          key.startsWith(makeStateManagerKey(EStateManagerTag.STATE, cid)) &&
          key.endsWith("out"),
        (key) => {
          const [_tab, _cid, keyName, _subfixText] = key.split(".");
          return keyName;
        },
      );
    },
  }),

  global: {
    state: (stateName: string) => ({
      value: {
        get: () => {
          return stateManager.getValue(makeGlobalKey(stateName));
        },
        set: (value: unknown) => {
          return stateManager.setValue(makeGlobalKey(stateName), value);
        },
      },
    }),
  },

  workspace: {
    info: {
      // Cid
      cid: {
        get: () => {
          return stateManager.getValue<string>(makeWorkspaceKey("info.cid"));
        },
        set: (value: string) => {
          return stateManager.setValue(makeWorkspaceKey("info.cid"), value);
        },
      },

      // Name
      name: {
        get: () => {
          return stateManager.getValue<string>(makeWorkspaceKey("info.name"));
        },
        set: (value: string) => {
          return stateManager.setValue(makeWorkspaceKey("info.name"), value);
        },
      },

      // Description
      description: {
        get: () => {
          return stateManager.getValue<string>(
            makeWorkspaceKey("info.description"),
          );
        },
        set: (value: string) => {
          return stateManager.setValue(
            makeWorkspaceKey("info.description"),
            value,
          );
        },
      },

      // Image
      image: {
        get: () => {
          return stateManager.getValue<string>(makeWorkspaceKey("info.image"));
        },
        set: (value: string) => {
          return stateManager.setValue(makeWorkspaceKey("info.image"), value);
        },
      },

      // Time
      time: {
        get: () => {
          return stateManager.getValue<string>(makeWorkspaceKey("info.time"));
        },
        set: (value: string) => {
          return stateManager.setValue(makeWorkspaceKey("info.time"), value);
        },
      },
    },

    temp: {
      selectedCid: {
        get: () => {
          return stateManager.getValue<string>(
            makeWorkspaceKey("temp.selected-cid"),
          );
        },
        set: (value?: string | null) => {
          return stateManager.setValue(
            makeWorkspaceKey("temp.selected-cid"),
            value,
          );
        },
      },
    },

    layout: {
      scale: {
        get: () => {
          return stateManager.getValue<number>(
            makeWorkspaceKey("layout.scale"),
          );
        },
        set: (value: number) => {
          return stateManager.setValue(makeWorkspaceKey("layout.scale"), value);
        },
      },
      width: {
        get: () => {
          return stateManager.getValue<number>(
            makeWorkspaceKey("layout.width"),
          );
        },
        set: (value: number) => {
          return stateManager.setValue(makeWorkspaceKey("layout.width"), value);
        },
      },
      height: {
        get: () => {
          return stateManager.getValue<number>(
            makeWorkspaceKey("layout.height"),
          );
        },
        set: (value: number) => {
          return stateManager.setValue(
            makeWorkspaceKey("layout.height"),
            value,
          );
        },
      },
      resolution: {
        get: () => {
          return stateManager.getValue<string>(
            makeWorkspaceKey("layout.resolution"),
          );
        },
        set: (value: string) => {
          return stateManager.setValue(
            makeWorkspaceKey("layout.resolution"),
            value,
          );
        },
      },
    },
  },
});
