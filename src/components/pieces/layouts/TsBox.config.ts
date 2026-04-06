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

export const tBoxComponent: INativeComponent<any> = {
  cid: "TsBox",
  name: "Box",
  description: "The box that contains every thing",
  groups: COMMON_GROUPS,
  states: [STYLE_STATE],
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
  element: TsContainer,
  role: ENativeComponentRole.CONTAINER,
  tag: EComponentTag.LAYOUT,
  rndBehaviors: {
    disableTransform: true
  }
};
CTsComponentManager.instance.registerNativeComponent(tBoxComponent);
