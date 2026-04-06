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
  TsInputNumberEditor,
  ITsInputNumberEditorProps,
  TsSelectValueEditor,
  ITsSelectValueEditorProps,
} from "@components/editors";
import TsStack from "./TsStack";
import { COMMON_GROUPS, STATE_GROUP } from "../common-groups";
import { getStyleState } from "../common-states";

const FLEX_DIRECTION_STATE: INativeComponentState<
  ITsSelectValueEditorProps["options"],
  ITsSelectValueEditorProps
> = {
  name: "direction",
  description: "",
  type: "string",
  group: STATE_GROUP.id,
  defaultValue: "row",
  isStateIn: false,
  isStateOut: false,
  editor: {
    element: TsSelectValueEditor,
    options: {
      options: [
        { text: "Row", value: "row" },
        { text: "Column", value: "column" },
        { text: "Row Reverse", value: "row-reverse" },
        { text: "Column Reverse", value: "column-reverse" },
      ],
    },
  },
} as const;

const GAP_STATE: INativeComponentState<
  ITsInputNumberEditorProps["options"],
  ITsInputNumberEditorProps
> = {
  name: "gap",
  description: "",
  type: "number",
  defaultValue: 0,
  isStateIn: false,
  isStateOut: false,
  group: STATE_GROUP.id,
  editor: {
    element: TsInputNumberEditor,
    options: {
      defaultValue: 0,
      props: {
        min: 0,
        max: 100,
        step: 1,
      },
    },
  },
};

const JUSTIFY_CONTENT_STATE: INativeComponentState<
  ITsSelectValueEditorProps["options"],
  ITsSelectValueEditorProps
> = {
  name: "justifyContent",
  description: "",
  type: "string",
  group: STATE_GROUP.id,
  defaultValue: "flex-start",
  isStateIn: false,
  isStateOut: false,
  editor: {
    element: TsSelectValueEditor,
    options: {
      options: [
        { text: "Start", value: "flex-start" },
        { text: "Center", value: "center" },
        { text: "End", value: "flex-end" },
        { text: "Space Between", value: "space-between" },
        { text: "Space Around", value: "space-around" },
        { text: "Space Evenly", value: "space-evenly" },
      ],
    },
  },
} as const;

const ALIGN_ITEMS_STATE: INativeComponentState<
  ITsSelectValueEditorProps["options"],
  ITsSelectValueEditorProps
> = {
  name: "alignItems",
  description: "",
  type: "string",
  group: STATE_GROUP.id,
  defaultValue: "stretch",
  isStateIn: false,
  isStateOut: false,
  editor: {
    element: TsSelectValueEditor,
    options: {
      options: [
        { text: "Stretch", value: "stretch" },
        { text: "Start", value: "flex-start" },
        { text: "Center", value: "center" },
        { text: "End", value: "flex-end" },
        { text: "Baseline", value: "baseline" },
      ],
    },
  },
} as const;

const FLEX_WRAP_STATE: INativeComponentState<
  ITsSelectValueEditorProps["options"],
  ITsSelectValueEditorProps
> = {
  name: "wrap",
  description: "",
  type: "string",
  group: STATE_GROUP.id,
  defaultValue: "nowrap",
  isStateIn: false,
  isStateOut: false,
  editor: {
    element: TsSelectValueEditor,
    options: {
      options: [
        { text: "No Wrap", value: "nowrap" },
        { text: "Wrap", value: "wrap" },
        { text: "Wrap Reverse", value: "wrap-reverse" },
      ],
    },
  },
} as const;

export const tsContainerComponent: INativeComponent<any> = {
  cid: "TsStack",
  name: "Stack",
  description: "The stack that contains every thing",
  groups: COMMON_GROUPS,
  states: [
    FLEX_DIRECTION_STATE,
    GAP_STATE,
    JUSTIFY_CONTENT_STATE,
    ALIGN_ITEMS_STATE,
    FLEX_WRAP_STATE,
    getStyleState({
      excludes: ["flexDirection", "gap", "justifyContent", "alignItems", "flexWrap"]
    })
  ],
  version: ETsVersion._0_0_0,
  image: "/images/review/TsContainer.png",
  layout: {
    x: 0,
    y: 0,
    width: 200,
    height: 80,
    minWidth: 5,
    minHeight: 5,
  },
  element: TsStack,
  role: ENativeComponentRole.CONTAINER,
  tag: EComponentTag.LAYOUT,
  rndBehaviors: {
    disableTransform: true,
  },
};

CTsComponentManager.instance.registerNativeComponent(tsContainerComponent);
