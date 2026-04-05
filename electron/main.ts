/* eslint-disable @typescript-eslint/no-explicit-any */
import { app, BrowserWindow, ipcMain, protocol } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "fs";

import { TypeEntry, TypeSystem } from "./utils/type-system";
import "./ipc/graphic-components-store-ipc";
import "./ipc/graphic-pieces-store-ipc";
import "./ipc/application-store-ipc";
import { getAbsolutePath } from "./utils/image-saver";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// 🔥 expose global
require;
(global as any).__filename = __filename;
(global as any).__dirname = __dirname;

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  // Handle image:// protocol
  protocol.handle("images", async (request) => {
    try {
      const relative = request.url.replace("images://", "");
      if (relative.includes("..")) {
        return new Response("Forbidden", { status: 403 });
      }
      const absolutePath = getAbsolutePath(relative);
      const data = await fs.promises.readFile(absolutePath);
      return new Response(data, {
        headers: {
          "Content-Type": "image/png",
        },
      });
    } catch (err) {
      return new Response("Not Found", { status: 404 });
    }
  });
  createWindow();
});

// Electron APIs
ipcMain.handle("@electron/typeSystem/clearTypes", async (_event) => {
  return TypeSystem.instance.clearTypes();
});
ipcMain.handle(
  "@electron/typeSystem/isAssignable",
  async (_event, typeA: string, typeB: string) => {
    return TypeSystem.instance.isAssignable(typeA, typeB);
  },
);
ipcMain.handle(
  "@electron/typeSystem/isEqual",
  async (_event, typeA: string, typeB: string) => {
    return TypeSystem.instance.isEqual(typeA, typeB);
  },
);
ipcMain.handle("@electron/typeSystem/listTypes", async (_event) => {
  return TypeSystem.instance.listTypes();
});
ipcMain.handle(
  "@electron/typeSystem/registerType",
  async (_event, type: TypeEntry) => {
    return TypeSystem.instance.registerType(type);
  },
);
ipcMain.handle(
  "@electron/typeSystem/removeType",
  async (_event, name: string) => {
    return TypeSystem.instance.removeType(name);
  },
);
ipcMain.handle(
  "@electron/typeSystem/validateType",
  async (_event, text: string, native?: boolean) => {
    return TypeSystem.instance.validateType(text, native);
  },
);
ipcMain.handle("@electron/typeSystem/getAllTypes", async (_event) => {
  return TypeSystem.instance.getAllTypes();
});
