import {
  CTsFuncManager,
  EFuncDefParamEditorType,
  EFuncStateParamType,
  IFuncDef,
} from "@contexts/editor";
import { ACCESSORS } from "@data/editor";

const setGraphicVisibleFunc: IFuncDef = {
  id: "set-graphic-visible-func",
  name: "graphic.setVisible",
  description: "",
  params: [
    {
      name: "cid",
      description: "",
      type: "string",
      defaultType: EFuncStateParamType.STATE_KEY,
    },
    {
      name: "value",
      description: "",
      type: "boolean",
      defaultType: EFuncStateParamType.DEFAULT,
      elementType: EFuncDefParamEditorType.CHECKBOX,
    },
  ],
  returnType: "void",
  isPromise: false,
  executor:
    ({ stateManager }) =>
    (cid: unknown, value: unknown) => {
      if (typeof cid !== "string") {
        throw new Error("Invalid cid");
      }
      const ACC_DATA = ACCESSORS(stateManager).component(cid).data;
      ACC_DATA.visible.set(value !== "false" && Boolean(value));
    },
  hasOutput: false,
  hasError: true,
};

CTsFuncManager.instance.registerFunc(setGraphicVisibleFunc);
