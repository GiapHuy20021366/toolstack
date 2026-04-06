import { IGraphicComponent } from "@contexts/editor";
import Store from "electron-store";

export interface IRecentGraphicInfo {
  cid: IGraphicComponent["cid"];
  name: IGraphicComponent["name"];
  time: IGraphicComponent["time"];
  image: IGraphicComponent["image"];
  updatedAt: number;
}

export interface IDeleteGraphicInfo extends IGraphicComponent {
  deletedAt: number;
}

export interface IGraphicComponentsStoreSchema {
  graphics: Record<string, IGraphicComponent>;
  recent: Record<string, IRecentGraphicInfo>;
  deletes: Record<string, IDeleteGraphicInfo>;
};
export const graphicComponentsStore = new Store<IGraphicComponentsStoreSchema>({
  name: "graphicComponents",
  defaults: {
    graphics: {},
    recent: {},
    deletes: {},
  },
});
