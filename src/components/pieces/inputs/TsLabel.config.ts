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
  ITsInputTextEditorLazyProps,
  TsInputTextEditorLazy,
} from "@components/editors";
import TsLabel from "./TsLabel";
import { COMMON_GROUPS, STATE_GROUP } from "../common-groups";
import { STYLE_STATE } from "../common-states";

const LABEL_STATE: INativeComponentState<
  ITsInputTextEditorLazyProps["options"],
  ITsInputTextEditorLazyProps
> = {
  name: "label",
  description: "",
  type: "string",
  group: STATE_GROUP.id,
  isStateIn: true,
  isStateOut: false,
  defaultValue: "Label",
  editor: {
    element: TsInputTextEditorLazy,
    options: {},
  },
} as const;

export const tsInputLabelComponent: INativeComponent<any> = {
  cid: "TsLabel",
  name: "Label",
  description: "The label element",
  groups: COMMON_GROUPS,
  element: TsLabel,
  states: [LABEL_STATE, STYLE_STATE],
  version: ETsVersion._0_0_0,
  image: "/images/review/TsLabel.png",
  layout: {
    x: 0,
    y: 0,
    width: 45,
    height: 25,
    minWidth: 10,
    minHeight: 25,
  },
  role: ENativeComponentRole.ELEMENT,
  tag: EComponentTag.INPUT,
};
CTsComponentManager.instance.registerNativeComponent(tsInputLabelComponent);
