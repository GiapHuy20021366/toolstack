/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CTsComponentManager,
  INativeComponent,
  INativeComponentState,
} from "../../manager/component-manager";
import { ETsVersion } from "../../manager/version-manager";
import TsSelect from "./TsSelect";
import TsInputTextEditorLazy, {
  ITsInputTextEditorLazyProps,
} from "../editors/TsInputTextEditorLazy";

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
  ITsInputTextEditorLazyProps["options"],
  ITsInputTextEditorLazyProps
> = {
  name: "options",
  description: "",
  type: "string",
  defaultValue: [],
  editor: {
    element: TsInputTextEditorLazy,
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
  states: [VALUE_STATE, OPTIONS_STATE, VALUE_KEY_STATE, TEXT_KEY_STATE],
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
  isContainer: false,
};
CTsComponentManager.instance.registerNativeComponent(tsSelectComponent);
