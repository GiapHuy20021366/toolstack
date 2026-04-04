import { INativeComponentState } from "@contexts/editor";
import { TsFuncEditor, ITsFuncEditorProps } from "@components/editors";

export const ON_CHANGE_EVENT: INativeComponentState<
    ITsFuncEditorProps["options"],
    ITsFuncEditorProps
> = {
    name: "on-change",
    description: "",
    type: "function",
    isStateIn: false,
    isStateOut: false,
    defaultValue: null,
    editor: {
        element: TsFuncEditor,
        options: {},
    },
} as const;
