import { ipcMain } from "electron";
import { graphicComponentsStore, IRecentGraphicInfo } from "../stores/graphic-components-store";
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

    // Base64 convert
    if (graphic.image?.startsWith("data:image")) {
      const savedPath = saveBase64Image(graphic.image, graphic.cid);
      if (savedPath) {
        imagePath = savedPath;
        graphic.image = savedPath;
      }
    }
    graphics[graphic.cid] = {
      ...graphic,
      image: imagePath,
    };
    graphicComponentsStore.set("graphics", graphics);

    // Update recent list
    const recent = graphicComponentsStore.get("recent");
    recent[graphic.cid] = {
      cid: graphic.cid,
      image: graphic.image,
      name: graphic.name,
      time: graphic.time,
      updatedAt: Date.now()
    };
    const recentGraphics = Object.values(recent).sort((g1, g2) => g2.updatedAt - g1.updatedAt).slice(0, 15);
    const newRecent: Record<string, IRecentGraphicInfo> = {}
    for (const g of recentGraphics) {
      newRecent[g.cid] = g;
    }
    graphicComponentsStore.set("recent", newRecent);

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
      delete graphics[cid];
    }
    graphicComponentsStore.set("graphics", graphics);

    // Update recent list
    const recent = graphicComponentsStore.get("recent");
    if (cid in recent) {
      delete recent[cid];
    }
    graphicComponentsStore.set("recent", recent);

    // Add to delete list
    const deletes = graphicComponentsStore.get("deletes");
    deletes[graphic.cid] = {
      ...graphic,
      deletedAt: Date.now()
    }
    graphicComponentsStore.set("deletes", deletes);
  },
);

ipcMain.handle(
  "graphicComponentsStoreAPI/graphics/revert",
  (_, cid: string) => {
    const deletes = graphicComponentsStore.get("deletes");
    const graphic = deletes[cid];
    if (graphic == null) return;


    // Remove from delete list
    delete deletes[cid];
    graphicComponentsStore.set("deletes", deletes);

    // Add to graphic list
    const graphics = graphicComponentsStore.get("graphics");
    graphics[cid] = graphic;
    graphicComponentsStore.set("graphics", graphics);

    // Add to recent list
    const recent = graphicComponentsStore.get("recent");
    recent[graphic.cid] = {
      cid: graphic.cid,
      image: graphic.image,
      name: graphic.name,
      time: graphic.time,
      updatedAt: Date.now()
    };
    const recentGraphics = Object.values(recent).sort((g1, g2) => g2.updatedAt - g1.updatedAt).slice(0, 15);
    const newRecent: Record<string, IRecentGraphicInfo> = {}
    for (const g of recentGraphics) {
      newRecent[g.cid] = g;
    }
    graphicComponentsStore.set("recent", newRecent);
  },
);

ipcMain.handle(
  "graphicComponentsStoreAPI/graphics/remove",
  (_, cid: string) => {
    const deletes = graphicComponentsStore.get("deletes");
    const graphic = deletes[cid];
    if (graphic == null) return;


    // Remove from delete list and remove image
    delete deletes[cid];
    deleteImage(getAbsolutePath(graphic.image));
    graphicComponentsStore.set("deletes", deletes);
  },
);

ipcMain.handle(
  "graphicComponentsStoreAPI/graphics/getRecentList",
  (_) => {
    const recent = graphicComponentsStore.get("recent");
    return recent;
  },
);
ipcMain.handle(
  "graphicComponentsStoreAPI/graphics/getDeleteList",
  (_) => {
    const deletes = graphicComponentsStore.get("deletes");
    return deletes;
  },
);