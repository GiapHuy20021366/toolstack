import { ipcMain } from "electron";
import { graphicPiecesStore } from "../stores/graphic-pieces-store";
import { IGraphicComponent } from "@contexts/editor";
import {
  deleteImage,
  getAbsolutePath,
  saveBase64Image,
} from "../utils/image-saver";

ipcMain.handle(
  "graphicPiecesStoreAPI/pieces/save",
  (_, graphic: IGraphicComponent) => {
    const graphics = graphicPiecesStore.get("pieces");

    let imagePath = graphic.image;
    if (graphic.image?.startsWith("data:image")) {
      const savedPath = saveBase64Image(graphic.image, graphic.cid);
      if (savedPath) {
        imagePath = savedPath;
      }
    }
    graphics[graphic.cid] = {
      ...graphic,
      image: imagePath,
    };
    graphicPiecesStore.set("pieces", graphics);
    return graphics[graphic.cid];
  },
);

ipcMain.handle("graphicPiecesStoreAPI/pieces/get", (_, cid: string) => {
  const graphics = graphicPiecesStore.get("pieces");
  return graphics[cid] ?? null;
});

ipcMain.handle("graphicPiecesStoreAPI/pieces/getAll", () => {
  return graphicPiecesStore.get("pieces");
});

ipcMain.handle("graphicPiecesStoreAPI/pieces/delete", (_, cid: string) => {
  const graphics = graphicPiecesStore.get("pieces");
  const graphic = graphics[cid];
  if (graphic != null && graphic.image) {
    deleteImage(getAbsolutePath(graphic.image));
    delete graphics[cid];
  }
  graphicPiecesStore.set("pieces", graphics);
});
