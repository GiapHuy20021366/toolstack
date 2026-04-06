import { IGraphicComponent } from "@contexts/editor";
import { IDeleteGraphicInfo, IRecentGraphicInfo } from "electron/stores/graphic-components-store";

export interface IGraphicComponentsStoreAPI {
  graphics: {
    save(data: IGraphicComponent): Promise<IGraphicComponent>;
    get(cid: string): Promise<IGraphicComponent | null>;
    getAll(): Promise<Record<string, IGraphicComponent>>;
    delete(cid: string): Promise<void>;
    revert(cid: string): Promise<void>;
    remove(cid: string): Promise<void>;
    getRecentList(): Promise<Record<string, IRecentGraphicInfo>>;
    getDeleteList(): Promise<Record<string, IDeleteGraphicInfo>>;
  };
}
