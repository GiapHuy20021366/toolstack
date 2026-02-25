/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import useTsContext from "./useTsContext";
import {
  ISetValueEventData,
  TsVariableManagerEvent,
} from "../manager/variable-manager";

export interface IUseTsStateOptions<T = unknown> {
  key: string;
  defaultValue: T;
}

/**
 * A hook to integrated with tool stack context for centralize state manager
 * @param options
 * @returns
 */
export default function useTsState<T>(
  options: IUseTsStateOptions<T>,
): [T, (value: React.SetStateAction<T | undefined>) => void] {
  const { stateManager } = useTsContext();
  const innerUpdateCountRef = useRef(0);
  const [_state, _setState] = useState<T>(() => {
    const { key } = options;
    const parentValue = stateManager.getValue(key);
    if (parentValue === undefined) {
      innerUpdateCountRef.current = stateManager.setValue(
        key,
        options.defaultValue,
        { silent: true },
      );
      return options.defaultValue;
    } else {
      innerUpdateCountRef.current = stateManager.getUpdateCount(key) || 0;
      return parentValue as T;
    }
  });

  /**
   * Bottom up state sync
   */
  const setState = useCallback(
    (value: React.SetStateAction<T | undefined>) => {
      _setState((state) => {
        const newValue =
          typeof value === "function" ? (value as any)(state) : value;
        const { key } = options;
        innerUpdateCountRef.current =
          (stateManager.getUpdateCount(key) ?? 0) + 1;
        setTimeout(() => {
          innerUpdateCountRef.current = stateManager.setValue(key, newValue);
        });
        return newValue;
      });
    },
    [options, stateManager],
  );

  /**
   * Top down state sync
   */
  useEffect(() => {
    const eventName = TsVariableManagerEvent.SET_VALUE_KEY(options.key);
    const listener = ({ count, newValue: value }: ISetValueEventData<T>) => {
      if (count > innerUpdateCountRef.current) {
        _setState(value);
        innerUpdateCountRef.current = count;
      }
    };
    stateManager.addListener(eventName, listener);
    return () => {
      stateManager.removeListener(eventName, listener);
    };
  }, [options, stateManager]);

  return [_state, setState];
}
