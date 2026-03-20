/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CTsComponentManager,
  ENativeComponentRole,
  INativeComponent,
} from "../../manager/component-manager";
import { ETsVersion } from "../../manager/version-manager";
import TsContainer from "./TsContainer";

export const tsLayerComponent: INativeComponent<any> = {
  cid: "TsLayer",
  name: "Layer",
  description: "The layer that contains every thing",
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
  role: ENativeComponentRole.LAYER,
};
CTsComponentManager.instance.registerNativeComponent(tsLayerComponent);
