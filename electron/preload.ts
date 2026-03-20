import { ipcRenderer, contextBridge } from "electron";
import { IElectronAPI } from "./electron-api";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args),
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },

  // You can expose other APTs you need here.
  // ...
});

contextBridge.exposeInMainWorld("electron", {
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
