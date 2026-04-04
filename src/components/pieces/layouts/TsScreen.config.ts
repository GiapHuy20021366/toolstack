/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CTsComponentManager,
  EComponentTag,
  ENativeComponentRole,
  INativeComponent,
  ETsVersion
} from "@contexts/editor";
import TsContainer from "./TsContainer";

export const tsScreenComponent: INativeComponent<any> = {
  cid: "TsScreen",
  name: "Screen",
  description: "The screen that contains every thing",
  states: [],
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
  role: ENativeComponentRole.SCREEN,
  tag: EComponentTag.LAYOUT
};
CTsComponentManager.instance.registerNativeComponent(tsScreenComponent);
