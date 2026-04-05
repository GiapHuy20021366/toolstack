import { ipcMain } from "electron";
import { applicationStore } from "../stores/application-store";

ipcMain.handle(
  "applicationStoreAPI/externals/save",
  (_, key: string, data: unknown) => {
    const externals = applicationStore.get("externals");
    externals[key] = data;
    applicationStore.set("externals", externals);
  },
);

ipcMain.handle("applicationStoreAPI/externals/get", (_, key: string) => {
  const externals = applicationStore.get("externals");
  return externals[key] ?? null;
});

ipcMain.handle("applicationStoreAPI/externals/getAll", () => {
  return applicationStore.get("externals");
});

ipcMain.handle("applicationStoreAPI/externals/delete", (_, key: string) => {
  const externals = applicationStore.get("externals");
  delete externals[key];
  applicationStore.set("externals", externals);
});
