/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CTsComponentManager,
  EComponentTag,
  ENativeComponentRole,
  INativeComponent,
  ETsVersion,
  INativeComponentState,
} from "@contexts/editor";
import TsStateWatcher from "./TsStateWatcher";
import {
  ITsFuncEditorProps,
  ITsInputTextEditorLazyProps,
  TsFuncEditor,
  TsInputTextEditorLazy,
} from "@/components/editors";
import { COMMON_GROUPS, EVENT_GROUP } from "../common-groups";

const KEY_STATE: INativeComponentState<
  ITsInputTextEditorLazyProps["options"],
  ITsInputTextEditorLazyProps
> = {
  name: "key",
  description: "",
  group: EVENT_GROUP.id,
  type: "string",
  isStateIn: true,
  isStateOut: false,
  defaultValue: "text",
  editor: {
    element: TsInputTextEditorLazy,
    options: {},
  },
} as const;

export const ON_CHANGE_EVENT: INativeComponentState<
  ITsFuncEditorProps["options"],
  ITsFuncEditorProps
> = {
  name: "on-change",
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

export const tsStateWatcherComponent: INativeComponent<any> = {
  cid: "TsStateWatcher",
  name: "StateWatcher",
  description: "The state watcher component",
  groups: COMMON_GROUPS,
  states: [KEY_STATE, ON_CHANGE_EVENT],
  version: ETsVersion._0_0_0,
  image: "/images/review/TsContainer.png",
  layout: {
    x: 0,
    y: 0,
    width: 200,
    height: 80,
    minWidth: 40,
    minHeight: 40,
  },
  element: TsStateWatcher,
  role: ENativeComponentRole.CONTAINER,
  tag: EComponentTag.STATE,
};
CTsComponentManager.instance.registerNativeComponent(tsStateWatcherComponent);
