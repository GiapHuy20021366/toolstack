/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CTsComponentManager,
  EComponentTag,
  ENativeComponentRole,
  INativeComponent,
  ETsVersion,
  INativeComponentState,
} from "@contexts/editor";
import TsGroupFunction from "./TsGroupFunction";
import {
  ITsInputCheckboxValueCheckProps,
  TsInputCheckboxValueCheck,
} from "@components/editors";

const PARALLEL_STATE: INativeComponentState<
  ITsInputCheckboxValueCheckProps["options"],
  ITsInputCheckboxValueCheckProps
> = {
  name: "parallel",
  description: "",
  type: "boolean",
  isStateIn: false,
  isStateOut: false,
  defaultValue: false,
  editor: {
    element: TsInputCheckboxValueCheck,
    options: { inputTypeKey: "type" },
  },
} as const;

const SKIP_ERROR_STATE: INativeComponentState<
  ITsInputCheckboxValueCheckProps["options"],
  ITsInputCheckboxValueCheckProps
> = {
  name: "skip-error",
  description: "",
  type: "boolean",
  isStateIn: false,
  isStateOut: false,
  defaultValue: false,
  editor: {
    element: TsInputCheckboxValueCheck,
    options: { inputTypeKey: "type" },
  },
} as const;

export const tsGroupFunctionComponent: INativeComponent<any> = {
  cid: "TsGroupFunction",
  name: "GroupFunction",
  description: "The function component",
  states: [PARALLEL_STATE, SKIP_ERROR_STATE],
  version: ETsVersion._0_0_0,
  image: "/images/review/TsContainer.png",
  layout: {
    x: 0,
    y: 0,
    width: 200,
    height: 80,
    minWidth: 40,
    minHeight: 40,
  },
  element: TsGroupFunction,
  role: ENativeComponentRole.CONTAINER,
  tag: EComponentTag.FUNCTION,
};
CTsComponentManager.instance.registerNativeComponent(tsGroupFunctionComponent);
