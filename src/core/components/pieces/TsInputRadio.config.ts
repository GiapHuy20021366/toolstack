/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CTsComponentManager,
  INativeComponent,
  INativeComponentState,
} from "../../manager/component-manager";
import { ETsVersion } from "../../manager/version-manager";

import TsInputCheckboxValueCheck, {
  ITsInputCheckboxValueCheckProps,
} from "../editors/TsInputCheckboxValueCheck";
import TsInputRadio from "./TsInputRadio";
import TsInputTextEditorLazy, {
  ITsInputTextEditorLazyProps,
} from "../editors/TsInputTextEditorLazy";

const VALUE_STATE: INativeComponentState<
  ITsInputCheckboxValueCheckProps["options"],
  ITsInputCheckboxValueCheckProps
> = {
  name: "value",
  description: "",
  type: "boolean",
  isStateIn: false,
  isStateOut: false,
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
  isContainer: false,
};
CTsComponentManager.instance.registerNativeComponent(tsInputRadioComponent);
