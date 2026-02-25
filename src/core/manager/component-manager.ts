/* eslint-disable @typescript-eslint/no-explicit-any */
import z from "zod";
import { ETsVersion } from "./version-manager";

export interface ITsStateProps<IOptions> {
  cid: string;
  state: ITsComponentState<IOptions>;
  options?: IOptions;
}

export interface ITsComponentState<
  IOptions = unknown,
  IProps = ITsStateProps<IOptions>,
> {
  name: string;
  type: z.ZodType;
  description: string;
  defaultValue: any;
  isStateIn?: boolean; // default false
  isStateOut?: boolean; // default true
  hide?: boolean; // default false
  editable?: boolean; // default true
  editor?: {
    element: (props: IProps) => JSX.Element;
    options: IOptions;
  };
}

export interface ITsComponent<Props = unknown> {
  name: string;
  version: ETsVersion;
  states: ITsComponentState<any>[];
  component: (props?: Props) => JSX.Element;
}

export class CTsComponentManager {
  private static componentMap: Map<string, ITsComponent<any>> = new Map();

  public static registerComponent(component: ITsComponent<any>) {
    CTsComponentManager.componentMap.set(component.name, component);
  }

  public static getComponent(name: string) {
    return CTsComponentManager.componentMap.get(name);
  }
}
