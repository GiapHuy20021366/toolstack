/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CTsComponentManager,
  EComponentTag,
  ENativeComponentRole,
  INativeComponent,
  INativeComponentState,
  ETsVersion
} from "@contexts/editor";
import {
  TsInputCheckboxValueCheck,
  ITsInputCheckboxValueCheckProps,
} from "@components/editors";
import TsInputCheckbox from "./TsInputCheckbox";

const VALUE_STATE: INativeComponentState<
  ITsInputCheckboxValueCheckProps["options"],
  ITsInputCheckboxValueCheckProps
> = {
  name: "value",
  description: "",
  type: "string",
  isStateIn: false,
  isStateOut: false,
  defaultValue: false,
  editor: {
    element: TsInputCheckboxValueCheck,
    options: { inputTypeKey: "type" },
  },
} as const;

export const tsInputCheckboxComponent: INativeComponent<any> = {
  cid: "TsInputCheckbox",
  name: "Checkbox",
  description: "The input checkbox element",
  element: TsInputCheckbox,
  states: [VALUE_STATE],
  version: ETsVersion._0_0_0,
  image: "/images/review/TsInputCheckbox.png",
  layout: {
    x: 0,
    y: 0,
    width: 20,
    height: 20,
    minWidth: 20,
    minHeight: 20,
  },
  role: ENativeComponentRole.ELEMENT,
  tag: EComponentTag.INPUT
};
CTsComponentManager.instance.registerNativeComponent(tsInputCheckboxComponent);
