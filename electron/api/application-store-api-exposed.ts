import { contextBridge, ipcRenderer } from "electron";
import { IApplicationStoreAPI } from "./application-store-api";

contextBridge.exposeInMainWorld("applicationStoreAPI", {
  externals: {
    save(key, data) {
      return ipcRenderer.invoke(
        "applicationStoreAPI/externals/save",
        key,
        data,
      );
    },
    get(key) {
      return ipcRenderer.invoke("applicationStoreAPI/externals/get", key);
    },
    getAll() {
      return ipcRenderer.invoke("applicationStoreAPI/externals/getAll");
    },
    delete(key) {
      return ipcRenderer.invoke("applicationStoreAPI/externals/delete", key);
    },
  },
} as IApplicationStoreAPI);
