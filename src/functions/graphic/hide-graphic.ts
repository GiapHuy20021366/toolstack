import {
  CTsFuncManager,
  EFuncStateParamType,
  IFuncDef,
} from "@contexts/editor";
import { ACCESSORS } from "@data/editor";

const hideGraphicFunc: IFuncDef = {
  id: "hide-graphic-func",
  name: "graphic.hide",
  description: "",
  params: [
    {
      name: "cid",
      description: "",
      type: "string",
      defaultType: EFuncStateParamType.STATE_KEY,
    },
  ],
  returnType: "void",
  isPromise: false,
  executor:
    ({ stateManager }) =>
    (cid: unknown) => {
      if (typeof cid !== "string") {
        throw new Error("Invalid cid");
      }
      const ACC_DATA = ACCESSORS(stateManager).component(cid).data;
      ACC_DATA.visible.set(false);
    },
  hasOutput: false,
  hasError: true,
};

CTsFuncManager.instance.registerFunc(hideGraphicFunc);
