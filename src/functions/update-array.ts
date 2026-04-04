/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CTsFuncManager,
  EFuncStateParamType,
  IFuncDef,
} from "../contexts/editor/func-manager";

const updateArrayFunc: IFuncDef = {
  id: "update-array-func",
  name: "updateArray",
  description: "",
  params: [
    {
      name: "state",
      description: "",
      type: "string",
      defaultType: EFuncStateParamType.STATE_KEY,
      defaultValue: "",
    },
    {
      name: "element",
      description: "",
      type: "object",
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
    (state: unknown, element: unknown, idField: unknown) => {
      if (
        typeof state !== "string" ||
        typeof idField !== "string" ||
        typeof element !== "object" ||
        element == null
      ) {
        throw new Error("Invalid parameters");
      }
      let arr = stateManager.getValue<object[]>(state);
      if (arr != null && !Array.isArray(arr)) {
        throw new Error("State is not an array");
      }
      arr ??= [] as object[];

      const foundIndex = arr.findIndex((item) => {
        if (typeof item !== "object" || item == null) return false;
        return (item as any)[idField] === (element as any)[idField];
      });
      if (foundIndex >= 0) {
        arr[foundIndex] = element;
      } else {
        arr.push(element);
      }
      stateManager.setValue(state, [...arr]);
    },
  hasOutput: true,
  hasError: false,
};

CTsFuncManager.instance.registerFunc(updateArrayFunc);
