/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CTsComponentManager,
  EComponentTag,
  ENativeComponentRole,
  INativeComponent,
  INativeComponentState,
  ETsVersion
} from "@contexts/editor";
import TsSelect from "./TsSelect";
import {
  TsInputTextEditorLazy,
  ITsInputTextEditorLazyProps,
  TsInputTextAreaEditorLazy,
  ITsInputTextAreaEditorLazyProps
} from "@components/editors";
import { ON_CHANGE_EVENT } from "./input-events";

const VALUE_STATE: INativeComponentState<
  ITsInputTextEditorLazyProps["options"],
  ITsInputTextEditorLazyProps
> = {
  name: "value",
  description: "",
  type: "string",
  isStateIn: false,
  editable: false,
  isStateOut: false,
  defaultValue: "",
  editor: {
    element: TsInputTextEditorLazy,
    options: {},
  },
  encoder: JSON.stringify,
  decoder: JSON.parse,
} as const;
const OPTIONS_STATE: INativeComponentState<
  ITsInputTextAreaEditorLazyProps["options"],
  ITsInputTextAreaEditorLazyProps
> = {
  name: "options",
  description: "",
  type: "string",
  defaultValue: [],
  editor: {
    element: TsInputTextAreaEditorLazy,
    options: {},
  },
  validator(value) {
    try {
      const val = JSON.parse(value);
      if (!Array.isArray(val)) {
        return ["Invalid array"];
      } else {
        return null;
      }
    } catch (error) {
      return ["Invalid JSON"];
    }
  },
  encoder: JSON.stringify,
  decoder: JSON.parse,
} as const;
const VALUE_KEY_STATE: INativeComponentState<
  ITsInputTextEditorLazyProps["options"],
  ITsInputTextEditorLazyProps
> = {
  name: "value-key",
  description: "",
  type: "string",
  isStateIn: false,
  isStateOut: false,
  defaultValue: "$$index",
  editor: {
    element: TsInputTextEditorLazy,
    options: {},
  },
} as const;
const TEXT_KEY_STATE: INativeComponentState<
  ITsInputTextEditorLazyProps["options"],
  ITsInputTextEditorLazyProps
> = {
  name: "text-key",
  description: "",
  type: "string",
  isStateIn: false,
  isStateOut: false,
  defaultValue: "$$option",
  editor: {
    element: TsInputTextEditorLazy,
    options: {},
  },
} as const;

export const tsSelectComponent: INativeComponent<any> = {
  cid: "TsSelect",
  name: "Select",
  description: "The select element",
  element: TsSelect,
  states: [VALUE_STATE, OPTIONS_STATE, VALUE_KEY_STATE, TEXT_KEY_STATE, ON_CHANGE_EVENT],
  version: ETsVersion._0_0_0,
  image: "/images/review/TsSelect.png",
  layout: {
    x: 0,
    y: 0,
    width: 180,
    height: 30,
    minWidth: 90,
    minHeight: 30,
  },
  role: ENativeComponentRole.ELEMENT,
  tag: EComponentTag.INPUT
};
CTsComponentManager.instance.registerNativeComponent(tsSelectComponent);
