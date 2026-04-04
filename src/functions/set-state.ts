import { CTsFuncManager, EFuncStateParamType, IFuncDef } from "../contexts/editor/func-manager";

const setStateFunc: IFuncDef = {
    id: "set-sate-func",
    name: "setState",
    description: "",
    params: [
        {
            name: "key",
            description: "",
            type: "any",
            defaultType: EFuncStateParamType.STATE_KEY
        },
        {
            name: "value",
            description: "",
            type: "any",
            defaultType: EFuncStateParamType.STATE_VALUE
        }
    ],
    returnType: "void",
    isPromise: false,
    executor: ({ stateManager }) => (key: unknown, value: unknown) => {
        if (typeof key === "string") {
            stateManager.setValue(key, value);
        }
    },
    hasOutput: false,
    hasError: false
}


CTsFuncManager.instance.registerFunc(setStateFunc);