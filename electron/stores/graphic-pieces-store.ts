import { IGraphicComponent } from "@contexts/editor";
import Store from "electron-store";

type StoreSchema = {
  pieces: Record<string, IGraphicComponent>;
};
export const graphicPiecesStore = new Store<StoreSchema>({
  name: "graphicPieces",
  defaults: {
    pieces: {},
  },
});
