import { contextBridge, ipcRenderer } from "electron";
import { IGraphicComponentsStoreAPI } from "./graphic-components-store-api";

contextBridge.exposeInMainWorld("graphicComponentsStoreAPI", {
  graphics: {
    delete(cid) {
      return ipcRenderer.invoke(
        "graphicComponentsStoreAPI/graphics/delete",
        cid,
      );
    },
    get(cid) {
      return ipcRenderer.invoke("graphicComponentsStoreAPI/graphics/get", cid);
    },
    getAll() {
      return ipcRenderer.invoke("graphicComponentsStoreAPI/graphics/getAll");
    },
    save(data) {
      return ipcRenderer.invoke(
        "graphicComponentsStoreAPI/graphics/save",
        data,
      );
    },
    revert(cid) {
      return ipcRenderer.invoke(
        "graphicComponentsStoreAPI/graphics/revert",
        cid,
      );
    },
    remove(cid) {
      return ipcRenderer.invoke(
        "graphicComponentsStoreAPI/graphics/remove",
        cid,
      );
    },
    getRecentList() {
      return ipcRenderer.invoke(
        "graphicComponentsStoreAPI/graphics/getRecentList",
      );
    },
    getDeleteList() {
      return ipcRenderer.invoke(
        "graphicComponentsStoreAPI/graphics/getDeleteList",
      );
    },
  },
} as IGraphicComponentsStoreAPI);
