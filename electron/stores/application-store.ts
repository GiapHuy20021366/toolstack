import Store from "electron-store";

type StoreSchema = {
  externals: Record<string, unknown>;
};
export const applicationStore = new Store<StoreSchema>({
  name: "application-store",
  defaults: {
    externals: {},
  },
});
