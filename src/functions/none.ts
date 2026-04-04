import { CTsFuncManager, IFuncDef } from "../contexts/editor/func-manager";

export const noneFunc: IFuncDef = {
    id: "none",
    name: "none",
    description: "",
    params: [
    ],
    returnType: "void",
    isPromise: false,
    executor: () => () => { },
    hasOutput: false,
    hasError: false
}
CTsFuncManager.instance.registerFunc(noneFunc);