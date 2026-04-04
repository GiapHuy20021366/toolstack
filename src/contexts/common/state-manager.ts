import EventEmitter from "eventemitter3";

export interface ISetValueOptions {
  silent?: boolean;
}

export const stateManagerEvent = {
  SET_VALUE_ANY: "@common/setValue",
  INNER_SET_VALUE_ANY: "@common/inner/setValue",
  SET_VALUE_KEY: (key: string) => `@common/setValue/${key}`,
  INNER_SET_VALUE_KEY: (key: string) => `@common/inner/setValue/${key}`,
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
export class StateManager extends EventEmitter {
  protected _keyValueMap: Map<string, unknown>;
  protected updateCountMap: Map<string, number>;

  constructor() {
    super();
    this._keyValueMap = new Map();
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

    // Emit event
    const eventData: ISetValueEventData = {
      count: newCount,
      key: key,
      oldValue: oldValue,
      newValue: value,
      options: options,
    };
    // Event to component
    if (options?.silent !== false) {
      // Emit to any
      this.emit(stateManagerEvent.SET_VALUE_ANY, eventData, this);
      // Emit specific by key
      this.emit(stateManagerEvent.SET_VALUE_KEY(key), eventData, this);
    }

    // Inner event
    this.emit(stateManagerEvent.INNER_SET_VALUE_ANY, eventData, this);
    this.emit(stateManagerEvent.INNER_SET_VALUE_KEY(key), eventData, this);
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

  get keyValueMap() {
    return this._keyValueMap;
  }

  set keyValueMap(value: Map<string, unknown>) {
    this._keyValueMap = value;
  }
}
