import { contextBridge, ipcRenderer } from "electron";
import { IElectronAPI } from "./electron-api";

contextBridge.exposeInMainWorld("electronAPI", {
  typeSystem: {
    clearTypes() {
      return ipcRenderer.invoke("@electron/typeSystem/clearTypes");
    },
    isAssignable(typeA, typeB) {
      return ipcRenderer.invoke(
        "@electron/typeSystem/isAssignable",
        typeA,
        typeB,
      );
    },
    isEqual(typeA, typeB) {
      return ipcRenderer.invoke("@electron/typeSystem/isEqual", typeA, typeB);
    },
    listTypes() {
      return ipcRenderer.invoke("@electron/typeSystem/listTypes");
    },
    registerType(type) {
      return ipcRenderer.invoke("@electron/typeSystem/registerType", type);
    },
    removeType(name) {
      return ipcRenderer.invoke("@electron/typeSystem/removeType", name);
    },
    validateType(text, native) {
      return ipcRenderer.invoke(
        "@electron/typeSystem/validateType",
        text,
        native,
      );
    },
    getAllTypes() {
      return ipcRenderer.invoke("@electron/typeSystem/getAllTypes");
    },
  },
} as IElectronAPI);
