/* eslint-disable @typescript-eslint/no-explicit-any */
import z from "zod";
import {
  CTsComponentManager,
  ITsComponent,
  ITsComponentState,
} from "../../manager/component-manager";
import TsInput from "./TsInput";
import { ETsVersion } from "../../manager/version-manager";
import TsInputInputTypeSelect, {
  ITsInputInputTypeSelectorProps,
} from "../editors/TsInputInputTypeSelector";
import TsInputInputValueEditor, {
  ITsInputInputValueEditorProps,
} from "../editors/TsInputInputValueEditor";

const TYPE_STATE: ITsComponentState<
  ITsInputInputTypeSelectorProps["options"],
  ITsInputInputTypeSelectorProps
> = {
  name: "type",
  description: "",
  type: z.string(),
  isStateIn: false,
  isStateOut: false,
  defaultValue: "text",
  editor: {
    element: TsInputInputTypeSelect,
    options: {},
  },
} as const;

const VALUE_STATE: ITsComponentState<
  ITsInputInputValueEditorProps["options"],
  ITsInputInputValueEditorProps
> = {
  name: "value",
  description: "",
  type: z.string(),
  isStateIn: false,
  isStateOut: false,
  defaultValue: "text",
  editor: {
    element: TsInputInputValueEditor,
    options: { inputTypeKey: "type" },
  },
} as const;

export const tsInputComponent: ITsComponent<any> = {
  name: "TsInput",
  component: TsInput,
  states: [TYPE_STATE, VALUE_STATE],
  version: ETsVersion._0_0_0,
};
CTsComponentManager.registerComponent(tsInputComponent);
