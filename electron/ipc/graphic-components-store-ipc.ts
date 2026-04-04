import { ipcMain } from "electron";
import { graphicComponentsStore } from "../stores/graphic-components-store";
import { IGraphicComponent } from "@contexts/editor";
import {
  deleteImage,
  getAbsolutePath,
  saveBase64Image,
} from "../utils/image-saver";

ipcMain.handle(
  "graphicComponentsStoreAPI/graphics/save",
  (_, graphic: IGraphicComponent) => {
    const graphics = graphicComponentsStore.get("graphics");

    let imagePath = graphic.image;

    // Nếu là base64 thì convert
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

    graphicComponentsStore.set("graphics", graphics);
    return graphics[graphic.cid];
  },
);

ipcMain.handle("graphicComponentsStoreAPI/graphics/get", (_, cid: string) => {
  const graphics = graphicComponentsStore.get("graphics");
  return graphics[cid] ?? null;
});

ipcMain.handle("graphicComponentsStoreAPI/graphics/getAll", () => {
  return graphicComponentsStore.get("graphics");
});

ipcMain.handle(
  "graphicComponentsStoreAPI/graphics/delete",
  (_, cid: string) => {
    const graphics = graphicComponentsStore.get("graphics");
    const graphic = graphics[cid];
    if (graphic != null && graphic.image) {
      deleteImage(getAbsolutePath(graphic.image));
      delete graphics[cid];
    }
    graphicComponentsStore.set("graphics", graphics);
  },
);
