import TsStyleEditor, { ITsStyleEditorProps } from "@components/editors/TsStyleEditor";
import { INativeComponentState } from "@contexts/editor";
import { STYLE_GROUP } from "./common-groups";

export const getStyleState = (options?: ITsStyleEditorProps["options"]): INativeComponentState<
    ITsStyleEditorProps["options"],
    ITsStyleEditorProps
> => {
    return {
        name: "style",
        description: "",
        type: "array",
        group: STYLE_GROUP.id,
        defaultValue: [["", ""]],
        isStateIn: false,
        isStateOut: false,
        editor: {
            element: TsStyleEditor,
            options: options,
        },
    }
}

export const STYLE_STATE = getStyleState();