import {
  CTsFuncManager,
  EFuncStateParamType,
  IFuncDef,
} from "@contexts/editor";
import { ACCESSORS } from "@data/editor";

const showGraphicFunc: IFuncDef = {
  id: "show-graphic-func",
  name: "graphic.show",
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
      ACC_DATA.visible.set(true);
    },
  hasOutput: false,
  hasError: true,
};

CTsFuncManager.instance.registerFunc(showGraphicFunc);
