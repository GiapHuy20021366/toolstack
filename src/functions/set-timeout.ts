import { CTsFuncManager, EFuncStateParamType, IFuncDef } from "../contexts/editor/func-manager";

const setTimeoutFunc: IFuncDef = {
    id: "set-timeout-func",
    name: "setTimeout",
    description: "",
    params: [
        {
            name: "time",
            description: "",
            type: "any",
            defaultType: EFuncStateParamType.JSON
        },
        {
            name: "resolve",
            description: "",
            type: "any",
            defaultType: EFuncStateParamType.JSON
        }
    ],
    returnType: "void",
    isPromise: true,
    executor: () => async (time: unknown, value: unknown) => {
        let timeVal = Number(time);
        timeVal = isNaN(timeVal) ? 0 : timeVal;
        timeVal = timeVal < 0 ? 0 : timeVal;
        return new Promise((rs) => {
            setTimeout(() => {
                rs(value);
            }, timeVal);
        });
    },
    hasOutput: true,
    hasError: true
}


CTsFuncManager.instance.registerFunc(setTimeoutFunc);