/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CTsComponentManager,
  EComponentTag,
  ENativeComponentRole,
  INativeComponent,
  ETsVersion
} from "@contexts/editor";
import TsContainer from "./TsContainer";

export const tsContainerComponent: INativeComponent<any> = {
  cid: "TsContainer",
  name: "Container",
  description: "The container that contains every thing",
  states: [],
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
  tag: EComponentTag.LAYOUT
};
CTsComponentManager.instance.registerNativeComponent(tsContainerComponent);
