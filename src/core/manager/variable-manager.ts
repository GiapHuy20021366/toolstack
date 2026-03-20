import EventEmitter from "eventemitter3";

export interface ISetValueOptions {
  silent?: boolean;
}

export const TsVariableManagerEvent = {
  SET_VALUE_ANY: "@common/setValue",
  SET_VALUE_KEY: (key: string) => `@common/setValue/${key}`,
} as const;

export interface ISetValueEventData<T = unknown> {
  key: string;
  oldValue: T | undefined;
  newValue: T;
  options?: ISetValueOptions;
  count: number;
}

/**
 * A class to manage key-value
 */
export class CTsVariableManager extends EventEmitter {
  protected keyValueMap: Map<string, unknown>;
  protected updateCountMap: Map<string, number>;

  constructor() {
    super();
    this.keyValueMap = new Map();
    this.updateCountMap = new Map();
  }

  getValue<T>(key: string): T | undefined {
    if (!this.keyValueMap.has(key)) {
      return undefined;
    } else {
      return this.keyValueMap.get(key) as T;
    }
  }

  getUpdateCount(key: string) {
    return this.updateCountMap.get(key);
  }

  setValue<T>(key: string, value: T, options?: ISetValueOptions): number {
    const oldValue = this.keyValueMap.get(key);
    if (value === oldValue) {
      return this.updateCountMap.get(key) ?? 0;
    }
    this.keyValueMap.set(key, value);
    const newCount = this.increaseUpdateCount(key);
    if (options?.silent !== false) {
      const eventData: ISetValueEventData = {
        count: newCount,
        key: key,
        oldValue: oldValue,
        newValue: value,
        options: options,
      };
      // Emit to any
      this.emit(TsVariableManagerEvent.SET_VALUE_ANY, eventData, this);
      // Emit specific by key
      this.emit(TsVariableManagerEvent.SET_VALUE_KEY(key), eventData, this);
    }
    return newCount;
  }

  setValueAll(
    map: Record<string, unknown>,
    options?: ISetValueOptions,
  ): Record<string, number> {
    const rs: Record<string, number> = {};
    for (const [key, value] of Object.entries(map)) {
      rs[key] = this.setValue(key, value, options);
    }
    return rs;
  }

  private increaseUpdateCount(key: string) {
    const count = (this.updateCountMap.get(key) || 0) + 1;
    this.updateCountMap.set(key, count);
    return count;
  }
}
