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
  TsSelectValueEditor,
  ITsSelectValueEditorOption,
  ITsSelectValueEditorProps,
  TsInputTextAreaEditorLazy,
  ITsInputTextAreaEditorLazyProps,
} from "@components/editors";
import TsInputJson from "./TsInputJson";
import { COMMON_GROUPS, STATE_GROUP } from "../common-groups";

export enum EJsonInputType {
  STRING = "string",
  NUMBER = "number",
  ARRAY = "array",
  OBJECT = "object",
  ANY = "any",
}

export const isValidInputValue = (value: string, type: EJsonInputType) => {
  try {
    const parsed = JSON.parse(value);
    switch (type) {
      case EJsonInputType.STRING: {
        return typeof parsed === "string";
      }
      case EJsonInputType.NUMBER: {
        return typeof parsed === "number";
      }
      case EJsonInputType.ARRAY: {
        return Array.isArray(parsed);
      }
      case EJsonInputType.OBJECT: {
        return typeof parsed === "object";
      }
      case EJsonInputType.ANY: {
        return true;
      }
    }
  } catch (error) {
    return false;
  }
};

export const JSON_TYPE_OPTIONS: ITsSelectValueEditorOption[] = [
  { text: "any", value: EJsonInputType.ANY },
  { text: "string", value: EJsonInputType.STRING },
  { text: "number", value: EJsonInputType.NUMBER },
  { text: "array", value: EJsonInputType.ARRAY },
  { text: "object", value: EJsonInputType.OBJECT },
] as const;

const TYPE_STATE: INativeComponentState<
  ITsSelectValueEditorProps["options"],
  ITsSelectValueEditorProps
> = {
  name: "type",
  description: "",
  type: EJsonInputType.ANY,
  group: STATE_GROUP.id,
  isStateIn: false,
  isStateOut: false,
  defaultValue: EJsonInputType.ANY,
  editor: {
    element: TsSelectValueEditor,
    options: {
      options: JSON_TYPE_OPTIONS,
    },
  },
} as const;

const VALUE_STATE: INativeComponentState<
  ITsInputTextAreaEditorLazyProps["options"],
  ITsInputTextAreaEditorLazyProps
> = {
  name: "value",
  description: "",
  type: "string",
  group: STATE_GROUP.id,
  isStateIn: true,
  isStateOut: true,
  editable: false,
  defaultValue: "text",
  editor: {
    element: TsInputTextAreaEditorLazy,
    options: {},
  },
  encoder: JSON.stringify,
  decoder: JSON.parse,
} as const;

export const tsInputJsonComponent: INativeComponent<any> = {
  cid: "TsJsonInput",
  name: "Json Input",
  description: "The json input element",
  groups: COMMON_GROUPS,
  element: TsInputJson,
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
  tag: EComponentTag.INPUT,
};
CTsComponentManager.instance.registerNativeComponent(tsInputJsonComponent);
