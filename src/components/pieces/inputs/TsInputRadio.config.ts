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
  TsInputCheckboxValueCheck,
  ITsInputCheckboxValueCheckProps,
  TsInputTextEditorLazy,
  ITsInputTextEditorLazyProps,
} from "@components/editors";
import TsInputRadio from "./TsInputRadio";
import { COMMON_GROUPS, STATE_GROUP } from "../common-groups";

const VALUE_STATE: INativeComponentState<
  ITsInputCheckboxValueCheckProps["options"],
  ITsInputCheckboxValueCheckProps
> = {
  name: "value",
  description: "",
  type: "boolean",
  group: STATE_GROUP.id,
  isStateIn: false,
  isStateOut: false,
  editable: false,
  defaultValue: true,
  editor: {
    element: TsInputCheckboxValueCheck,
    options: { inputTypeKey: "type" },
  },
} as const;

const NAME_STATE: INativeComponentState<
  ITsInputTextEditorLazyProps["options"],
  ITsInputTextEditorLazyProps
> = {
  name: "name",
  description: "",
  type: "string",
  group: STATE_GROUP.id,
  isStateIn: false,
  isStateOut: false,
  defaultValue: "text",
  editor: {
    element: TsInputTextEditorLazy,
    options: {},
  },
} as const;

export const tsInputRadioComponent: INativeComponent<any> = {
  cid: "TsInputRadio",
  name: "Radio",
  description: "The input radio element",
  groups: COMMON_GROUPS,
  element: TsInputRadio,
  states: [VALUE_STATE, NAME_STATE],
  version: ETsVersion._0_0_0,
  image: "/images/review/TsInputRadio.png",
  layout: {
    x: 0,
    y: 0,
    width: 20,
    height: 20,
    minWidth: 20,
    minHeight: 20,
  },
  role: ENativeComponentRole.ELEMENT,
  tag: EComponentTag.INPUT,
};
CTsComponentManager.instance.registerNativeComponent(tsInputRadioComponent);
