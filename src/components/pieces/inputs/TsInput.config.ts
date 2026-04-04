/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CTsComponentManager,
  EComponentTag,
  ENativeComponentRole,
  INativeComponent,
  INativeComponentState,
  ETsVersion
} from "@contexts/editor";
import TsInput from "./TsInput";
import {
  TsInputInputTypeSelector,
  ITsInputInputTypeSelectorProps,
  TsInputInputValueEditor,
  ITsInputInputValueEditorProps
} from "@components/editors";


const TYPE_STATE: INativeComponentState<
  ITsInputInputTypeSelectorProps["options"],
  ITsInputInputTypeSelectorProps
> = {
  name: "type",
  description: "",
  type: "string",
  isStateIn: false,
  isStateOut: false,
  defaultValue: "text",
  editor: {
    element: TsInputInputTypeSelector,
    options: {},
  },
} as const;

const VALUE_STATE: INativeComponentState<
  ITsInputInputValueEditorProps["options"],
  ITsInputInputValueEditorProps
> = {
  name: "value",
  description: "",
  type: "string",
  isStateIn: true,
  isStateOut: true,
  defaultValue: "text",
  editor: {
    element: TsInputInputValueEditor,
    options: { inputTypeKey: "type" },
  },
} as const;

export const tsInputComponent: INativeComponent<any> = {
  cid: "TsInput",
  name: "Input",
  description: "The input element",
  element: TsInput,
  states: [TYPE_STATE, VALUE_STATE],
  version: ETsVersion._0_0_0,
  image: "/images/review/TsInput.png",
  layout: {
    x: 0,
    y: 0,
    width: 183,
    height: 30,
    minWidth: 40,
    minHeight: 30,
  },
  role: ENativeComponentRole.ELEMENT,
  tag: EComponentTag.INPUT
};
CTsComponentManager.instance.registerNativeComponent(tsInputComponent);
