import { CTsFuncManager, IFuncDef } from "../contexts/editor/func-manager";

const alertFunc: IFuncDef = {
    id: "alert-func",
    name: "alert",
    description: "",
    params: [
        {
            name: "message",
            description: "",
            type: "any"
        }
    ],
    returnType: "void",
    isPromise: false,
    executor: () => (value: unknown) => {
        window.alert(value);
    },
    hasOutput: false,
    hasError: false
}


CTsFuncManager.instance.registerFunc(alertFunc);