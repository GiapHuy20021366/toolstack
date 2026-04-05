import {
  CTsFuncManager,
  EFuncStateParamType,
  IFuncDef,
} from "@contexts/editor";
import { ACCESSORS } from "@data/editor";

const toggleGraphicVisibleFunc: IFuncDef = {
  id: "toggle-graphic-visible-func",
  name: "graphic.toggleVisible",
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
      const currentVisible = ACC_DATA.visible.get() as unknown;
      ACC_DATA.visible.set(
        !(currentVisible === "true" || Boolean(currentVisible)),
      );
    },
  hasOutput: false,
  hasError: true,
};

CTsFuncManager.instance.registerFunc(toggleGraphicVisibleFunc);
