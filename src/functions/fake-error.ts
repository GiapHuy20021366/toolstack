import {
  CTsFuncManager,
  EFuncStateParamType,
  IFuncDef,
} from "../contexts/editor/func-manager";

const setTimeoutFunc: IFuncDef = {
  id: "fake-error-func",
  name: "fakeError",
  description: "",
  params: [
    {
      name: "message",
      description: "",
      type: "string",
      defaultType: EFuncStateParamType.JSON,
    },
  ],
  returnType: "void",
  isPromise: false,
  executor: () => async (message: unknown) => {
    throw new Error(String(message));
  },
  hasOutput: false,
  hasError: true,
};

CTsFuncManager.instance.registerFunc(setTimeoutFunc);
