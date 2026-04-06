/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CTsComponentManager,
  EComponentTag,
  ENativeComponentRole,
  INativeComponent,
  INativeComponentState,
  ETsVersion,
} from "@contexts/editor";
import {
  TsInputInputValueEditor,
  ITsInputInputValueEditorProps,
} from "@components/editors";
import { ON_CLICK_EVENT } from "./events";
import TsButton from "./TsButton";
import { COMMON_GROUPS, STATE_GROUP } from "../common-groups";
import { STYLE_STATE } from "../common-states";

const VALUE_STATE: INativeComponentState<
  ITsInputInputValueEditorProps["options"],
  ITsInputInputValueEditorProps
> = {
  name: "value",
  description: "",
  type: "string",
  group: STATE_GROUP.id,
  isStateIn: true,
  isStateOut: true,
  defaultValue: "text",
  editor: {
    element: TsInputInputValueEditor,
    options: { inputTypeKey: "type" },
  },
} as const;

const TEXT_STATE: INativeComponentState<
  ITsInputInputValueEditorProps["options"],
  ITsInputInputValueEditorProps
> = {
  name: "text",
  description: "",
  type: "string",
  group: STATE_GROUP.id,
  isStateIn: true,
  isStateOut: true,
  defaultValue: "text",
  editor: {
    element: TsInputInputValueEditor,
    options: { inputTypeKey: "type" },
  },
} as const;

export const tsInputComponent: INativeComponent<any> = {
  cid: "TsButton",
  name: "Button",
  description: "The button element",
  groups: COMMON_GROUPS,
  element: TsButton,
  states: [VALUE_STATE, TEXT_STATE, ON_CLICK_EVENT, STYLE_STATE],
  version: ETsVersion._0_0_0,
  image: "/images/review/TsButton.png",
  layout: {
    x: 0,
    y: 0,
    width: 100,
    height: 30,
    minWidth: 10,
    minHeight: 10,
  },
  role: ENativeComponentRole.ELEMENT,
  tag: EComponentTag.INPUT,
};
CTsComponentManager.instance.registerNativeComponent(tsInputComponent);
