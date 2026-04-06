import React, { useRef } from "react";
import {
  IStateWatcherListenerRef,
  useFuncExecutor,
  useGraphicDataClasses,
  useGraphicStateStyle,
  useGraphicStateValue,
  useStateWatcher,
} from "@hooks/editor";
import { IFuncState, getDefaultFuncStateValue } from "@contexts/editor";

interface IProps {
  cid: string;
  children?: React.ReactNode;
}

export default function TsStateWatcher({ cid, children }: IProps) {
  const { classes } = useGraphicDataClasses(cid);
  const { style } = useGraphicStateStyle(cid, false);

  const [key, _setKey] = useGraphicStateValue(cid, "key", "");
  const [onChangeEvent] = useGraphicStateValue<IFuncState>(
    cid,
    "on-change",
    getDefaultFuncStateValue(),
  );

  const { execute } = useFuncExecutor();
  const handleOnChangeRef = useRef<IStateWatcherListenerRef>({
    handler: (event) => {
      execute(
        onChangeEvent,
        {
          $$event: event,
          $$oldValue: event.oldValue,
          $$newValue: event.newValue,
        },
        {
          actionName: "on-change",
          cid: cid,
        },
      );
    },
  });
  // Always update the handler
  handleOnChangeRef.current.handler = (event) => {
    execute(
      onChangeEvent,
      {
        $$event: event,
        $$oldValue: event.oldValue,
        $$newValue: event.newValue,
      },
      {
        actionName: "on-change",
        cid: cid,
      },
    );
  };

  useStateWatcher(key ?? "", handleOnChangeRef.current);

  return (
    <div
      className={classes}
      style={{
        width: "100%",
        height: "100%",
        border: "1px solid black",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
