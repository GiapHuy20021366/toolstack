import {
  CTsFuncManager,
  EFuncStateParamType,
  IFuncDef,
  makeEditorGraphicStateKey,
} from "@contexts/editor";

const setStateValueFunc: IFuncDef = {
  id: "set-state-value-func",
  name: "state.setValue",
  description: "",
  params: [
    {
      name: "cid",
      description: "",
      type: "string",
      defaultType: EFuncStateParamType.STATE_KEY,
    },
    {
      name: "state",
      description: "",
      type: "string",
      defaultType: EFuncStateParamType.STATE_KEY,
    },
    {
      name: "value",
      description: "",
      type: "any",
      defaultType: EFuncStateParamType.STATE_VALUE,
    },
  ],
  returnType: "void",
  isPromise: false,
  executor:
    ({ stateManager }) =>
    (cid: unknown, state: unknown, value: unknown) => {
      if (typeof cid !== "string") {
        throw new Error("Invalid cid");
      }
      if (typeof state !== "string") {
        throw new Error("Invalid state");
      }
      stateManager.setValue(makeEditorGraphicStateKey(cid, state), value);
    },
  hasOutput: false,
  hasError: true,
};

CTsFuncManager.instance.registerFunc(setStateValueFunc);
