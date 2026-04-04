import { useEffect, useState } from "react";
import useEditorStateContext from "../useEditorStateContext";
import { analyzeInput, editorStateManagerEvent, IDependencies, ISetValueEventData, stateManagerEvent } from "@contexts/editor";

export interface IStateWatcherListenerRef {
    handler: (event: ISetValueEventData) => void
}

/**
 * A hook to access state via input pattern
 * @param input 
 * @returns 
 */
export default function useStateWatcher(
    input: string,
    listenerRef?: IStateWatcherListenerRef
) {
    const { stateManager } = useEditorStateContext();
    const [dependencies, setDependencies] = useState<IDependencies>(() => {
        return analyzeInput(stateManager, input);
    });
    const [stateValue, setStateValue] = useState(() => {
        return stateManager.getValue(dependencies.key);
    });

    useEffect(() => {
        const dependencies = analyzeInput(stateManager, input);
        setDependencies(dependencies);
    }, [stateManager, input]);

    useEffect(() => {
        setStateValue(stateManager.getValue(dependencies.key));

        const keyEvent = (event: ISetValueEventData) => {
            setStateValue(event.newValue);
            if (listenerRef != null) {
                listenerRef.handler(event);
            }
        }
        stateManager.addListener(stateManagerEvent.INNER_SET_VALUE_KEY(dependencies.key), keyEvent);

        const keyEvents: Record<string, (data: ISetValueEventData) => void> = {};
        dependencies.keys.forEach((key) => {
            keyEvents[key] = () => {
                const dependencies = analyzeInput(stateManager, input);
                setDependencies(dependencies);
            }
        });
        Object.entries(keyEvents).forEach(([key, event]) => {
            stateManager.addListener(stateManagerEvent.INNER_SET_VALUE_KEY(key), event);
        });

        const nameEvent = (data: ISetValueEventData) => {
            if (dependencies.names.includes(data.newValue as string)) {
                const dependencies = analyzeInput(stateManager, input);
                setDependencies(dependencies);
            }
        }
        stateManager.addListener(editorStateManagerEvent.SET_GRAPHIC_NAME, nameEvent);

        return () => {
            stateManager.removeListener(stateManagerEvent.INNER_SET_VALUE_KEY(dependencies.key), keyEvent);
            Object.entries(keyEvents).forEach(([key, event]) => {
                stateManager.removeListener(stateManagerEvent.INNER_SET_VALUE_KEY(key), event);
            });
            stateManager.removeListener(editorStateManagerEvent.SET_GRAPHIC_NAME, nameEvent);
        }
    }, [stateManager, dependencies, listenerRef]);

    return {
        stateValue: stateValue,
        dependencies: dependencies
    }
}