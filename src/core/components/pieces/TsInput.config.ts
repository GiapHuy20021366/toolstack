/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CTsComponentManager,
  ENativeComponentRole,
  INativeComponent,
  INativeComponentState,
} from "../../manager/component-manager";
import TsInput from "./TsInput";
import { ETsVersion } from "../../manager/version-manager";
import TsInputInputTypeSelect, {
  ITsInputInputTypeSelectorProps,
} from "../editors/TsInputInputTypeSelector";
import TsInputInputValueEditor, {
  ITsInputInputValueEditorProps,
} from "../editors/TsInputInputValueEditor";

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
    element: TsInputInputTypeSelect,
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
  isStateIn: false,
  isStateOut: false,
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
    height: 25,
    minWidth: 40,
    minHeight: 30,
  },
  role: ENativeComponentRole.ELEMENT,
};
CTsComponentManager.instance.registerNativeComponent(tsInputComponent);
