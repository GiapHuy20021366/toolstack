/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CTsComponentManager,
  EComponentTag,
  ENativeComponentRole,
  INativeComponent,
  ETsVersion,
  INativeComponentState,
} from "@contexts/editor";
import {
  ITsFuncEditorProps,
  ITsInputTextEditorLazyProps,
  TsFuncEditor,
  TsInputTextEditorLazy,
} from "@/components/editors";
import TsFunction from "./TsFunction";

const FUNC_LABEL_STATE: INativeComponentState<
  ITsInputTextEditorLazyProps["options"],
  ITsInputTextEditorLazyProps
> = {
  name: "func-label",
  description: "",
  type: "string",
  isStateIn: true,
  isStateOut: false,
  defaultValue: "Function",
  editor: {
    element: TsInputTextEditorLazy,
    options: {},
  },
} as const;

export const ACTION_STATE: INativeComponentState<
  ITsFuncEditorProps["options"],
  ITsFuncEditorProps
> = {
  name: "action",
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

export const tsFunctionComponent: INativeComponent<any> = {
  cid: "TsFunction",
  name: "Function",
  description: "The function component",
  states: [FUNC_LABEL_STATE, ACTION_STATE],
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
  element: TsFunction,
  role: ENativeComponentRole.CONTAINER,
  tag: EComponentTag.FUNCTION,
};
CTsComponentManager.instance.registerNativeComponent(tsFunctionComponent);
