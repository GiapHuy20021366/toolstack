import { IGraphicComponent } from "@contexts/editor";
import Store from "electron-store";

type StoreSchema = {
  graphics: Record<string, IGraphicComponent>;
};
export const graphicComponentsStore = new Store<StoreSchema>({
  name: "graphicComponents",
  defaults: {
    graphics: {},
  },
});
