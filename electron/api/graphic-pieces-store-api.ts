import { IGraphicComponent } from "@contexts/editor";

export interface IGraphicPiecesStoreAPI {
  pieces: {
    save(data: IGraphicComponent): Promise<IGraphicComponent>;
    get(cid: string): Promise<IGraphicComponent | null>;
    getAll(): Promise<Record<string, IGraphicComponent>>;
    delete(cid: string): Promise<void>;
  };
}
