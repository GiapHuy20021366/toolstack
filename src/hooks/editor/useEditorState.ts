/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  stateManagerEvent,
  ISetValueEventData,
} from "@/contexts/common/state-manager";
import useEditorStateContext from "./useEditorStateContext";

export interface IUseManageStateOptions<T = unknown> {
  key: string;
  defaultValue: T;
}

/**
 * A hook to integrated with tool stack context for centralize state manager
 * @param options
 * @returns
 */
export default function useManageState<T>(
  options: IUseManageStateOptions<T>,
): [T, (value: React.SetStateAction<T | undefined>) => void] {
  const { stateManager } = useEditorStateContext();
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
    // Update value when options change
    const { key } = options;
    const parentValue = stateManager.getValue<T>(key);
    if (parentValue === undefined) {
      innerUpdateCountRef.current = stateManager.setValue(
        key,
        options.defaultValue,
        { silent: true },
      );
      _setState(options.defaultValue);
    } else {
      innerUpdateCountRef.current = stateManager.getUpdateCount(key) || 0;
      _setState(parentValue);
    }

    // Handle event
    const eventName = stateManagerEvent.SET_VALUE_KEY(options.key);
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
