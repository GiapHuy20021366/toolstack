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
      console.log(data);
      return ipcRenderer.invoke(
        "graphicComponentsStoreAPI/graphics/save",
        data,
      );
    },
  },
} as IGraphicComponentsStoreAPI);
