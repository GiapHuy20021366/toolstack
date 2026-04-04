import { contextBridge, ipcRenderer } from "electron";
import { IGraphicPiecesStoreAPI } from "./graphic-pieces-store-api";

contextBridge.exposeInMainWorld("graphicPiecesStoreAPI", {
  pieces: {
    delete(cid) {
      return ipcRenderer.invoke("graphicPiecesStoreAPI/pieces/delete", cid);
    },
    get(cid) {
      return ipcRenderer.invoke("graphicPiecesStoreAPI/pieces/get", cid);
    },
    getAll() {
      return ipcRenderer.invoke("graphicPiecesStoreAPI/pieces/getAll");
    },
    save(data) {
      return ipcRenderer.invoke("graphicPiecesStoreAPI/pieces/save", data);
    },
  },
} as IGraphicPiecesStoreAPI);
