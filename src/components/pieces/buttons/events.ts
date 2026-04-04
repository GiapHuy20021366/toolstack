import { INativeComponentState } from "@contexts/editor";
import { TsFuncEditor, ITsFuncEditorProps } from "@components/editors";

export const ON_CLICK_EVENT: INativeComponentState<
    ITsFuncEditorProps["options"],
    ITsFuncEditorProps
> = {
    name: "on-click",
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
