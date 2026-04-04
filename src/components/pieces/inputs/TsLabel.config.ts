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

const LABEL_STATE: INativeComponentState<
  ITsInputTextEditorLazyProps["options"],
  ITsInputTextEditorLazyProps
> = {
  name: "label",
  description: "",
  type: "string",
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
  element: TsLabel,
  states: [LABEL_STATE],
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
