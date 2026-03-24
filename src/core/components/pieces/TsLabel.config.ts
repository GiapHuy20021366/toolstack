/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CTsComponentManager,
  EComponentTag,
  ENativeComponentRole,
  INativeComponent,
  INativeComponentState,
} from "../../manager/component-manager";
import { ETsVersion } from "../../manager/version-manager";
import TsInputTextEditor, {
  ITsInputTextEditorProps,
} from "../editors/TsInputTextEditor";
import TsLabel from "./TsLabel";

const LABEL_STATE: INativeComponentState<
  ITsInputTextEditorProps["options"],
  ITsInputTextEditorProps
> = {
  name: "label",
  description: "",
  type: "string",
  isStateIn: false,
  isStateOut: false,
  defaultValue: "Label",
  editor: {
    element: TsInputTextEditor,
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
  tag: EComponentTag.INPUT
};
CTsComponentManager.instance.registerNativeComponent(tsInputLabelComponent);
