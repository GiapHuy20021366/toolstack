export interface IApplicationStoreAPI {
  externals: {
    save(key: string, data: unknown): Promise<void>;
    get(key: string): Promise<unknown | null>;
    getAll(): Promise<Record<string, unknown>>;
    delete(key: string): Promise<void>;
  };
}
