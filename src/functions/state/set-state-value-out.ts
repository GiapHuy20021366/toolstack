import {
  CTsFuncManager,
  EFuncStateParamType,
  IFuncDef,
  makeEditorGraphicStateOutKey,
} from "@contexts/editor";

const setStateValueOutFunc: IFuncDef = {
  id: "set-state-value-out-func",
  name: "state.setValueOut",
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
      stateManager.setValue(makeEditorGraphicStateOutKey(cid, state), value);
    },
  hasOutput: false,
  hasError: true,
};

CTsFuncManager.instance.registerFunc(setStateValueOutFunc);
