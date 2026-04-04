import { CTsFuncManager, IFuncDef } from "../contexts/editor/func-manager";

const consoleLogFunc: IFuncDef = {
    id: "console-log-func",
    name: "console.log",
    description: "",
    params: [
        {
            name: "message",
            description: "",
            type: "any",
            series: true
        }
    ],
    returnType: "void",
    isPromise: false,
    executor: () => (...values: unknown[]) => {
        console.log(...values)
    },
    hasOutput: false,
    hasError: false
}


CTsFuncManager.instance.registerFunc(consoleLogFunc);