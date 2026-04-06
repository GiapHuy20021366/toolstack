/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CTsComponentManager,
  EComponentTag,
  ENativeComponentRole,
  INativeComponent,
  ETsVersion,
} from "@contexts/editor";
import TsContainer from "./TsContainer";
import { COMMON_GROUPS } from "../common-groups";
import { STYLE_STATE } from "../common-states";

export const tsLayerComponent: INativeComponent<any> = {
  cid: "TsLayer",
  name: "Layer",
  description: "The layer that contains every thing",
  groups: COMMON_GROUPS,
  states: [STYLE_STATE],
  version: ETsVersion._0_0_0,
  image: "/images/review/TsContainer.png",
  layout: {
    x: 0,
    y: 0,
    width: 300,
    height: 300,
    minWidth: 40,
    minHeight: 40,
  },
  element: TsContainer,
  role: ENativeComponentRole.LAYER,
  tag: EComponentTag.LAYOUT,
};
CTsComponentManager.instance.registerNativeComponent(tsLayerComponent);
