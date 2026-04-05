import { INativeComponentState } from "@contexts/editor";
import { TsFuncEditor, ITsFuncEditorProps } from "@components/editors";
import { EVENT_GROUP } from "../common-groups";

export const ON_CHANGE_EVENT: INativeComponentState<
  ITsFuncEditorProps["options"],
  ITsFuncEditorProps
> = {
  name: "on-change",
  description: "",
  group: EVENT_GROUP.id,
  type: "function",
  isStateIn: false,
  isStateOut: false,
  defaultValue: null,
  editor: {
    element: TsFuncEditor,
    options: {},
  },
} as const;
