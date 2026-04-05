/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CTsFuncManager,
  EFuncStateParamType,
  IFuncDef,
} from "../contexts/editor/func-manager";

const getArrayObjectElementFunc: IFuncDef = {
  id: "get-array-object-element-func",
  name: "getArrayObjectElement",
  description: "",
  params: [
    {
      name: "array",
      description: "",
      type: "array",
      defaultType: EFuncStateParamType.STATE_KEY,
      defaultValue: "",
    },
    {
      name: "element",
      description: "",
      type: "any",
      defaultType: EFuncStateParamType.STATE_VALUE,
      defaultValue: "",
    },
    {
      name: "id-field",
      description: "",
      type: "string",
      defaultType: EFuncStateParamType.STATE_KEY,
      defaultValue: "",
    },
  ],
  returnType: "void",
  isPromise: false,
  executor:
    ({ stateManager }) =>
    (array: unknown, element: unknown, idField: unknown) => {
      if (typeof array !== "string" || typeof idField !== "string") {
        throw new Error("Invalid parameters");
      }
      const value = stateManager.getValue<unknown>(array);
      if (value == null || !Array.isArray(value)) {
        throw new Error("State is not an array");
      }
      const found = value.find((item) => {
        if (typeof item !== "object" || item == null) return false;
        return (item as any)[idField] === element;
      });
      return found;
    },
  hasOutput: true,
  hasError: true,
};

CTsFuncManager.instance.registerFunc(getArrayObjectElementFunc);
