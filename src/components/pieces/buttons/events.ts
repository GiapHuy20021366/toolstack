import { INativeComponentState } from "@contexts/editor";
import { TsFuncEditor, ITsFuncEditorProps } from "@components/editors";
import { EVENT_GROUP } from "../common-groups";

export const ON_CLICK_EVENT: INativeComponentState<
    ITsFuncEditorProps["options"],
    ITsFuncEditorProps
> = {
    name: "on-click",
    description: "",
    type: "function",
    group: EVENT_GROUP.id,
    isStateIn: false,
    isStateOut: false,
    defaultValue: null,
    editor: {
        element: TsFuncEditor,
        options: {},
    },
} as const;
