import React, { useRef, useState } from "react";
import {
  useFuncExecutor,
  useGraphicDataClasses,
  useGraphicDataStyle,
  useGraphicRefRegistration,
  useGraphicStateValue,
} from "@hooks/editor";
import {
  IFuncExecutorContextScope,
  IFuncState,
  getDefaultFuncStateValue,
} from "@contexts/editor";

interface IProps {
  cid: string;
  children?: React.ReactNode;
}

interface IFunctionRef {
  action: (scope: IFuncExecutorContextScope) => Promise<void>;
}

export default function TsFunction({ cid, children }: IProps) {
  const { classes } = useGraphicDataClasses(cid);
  const { style } = useGraphicDataStyle(cid);

  const [btnLabel] = useGraphicStateValue<string>(cid, "btn-label", "");
  const { execute } = useFuncExecutor();
  const [onActionEvent] = useGraphicStateValue<IFuncState>(
    cid,
    "action",
    getDefaultFuncStateValue(),
  );

  const [runCount, setRunCount] = useState(0);

  const ref = useRef<IFunctionRef>({
    action: async () => {},
  });

  //  Always update ref and registration
  ref.current.action = async (scope: IFuncExecutorContextScope) => {
    setRunCount((c) => c + 1);
    try {
      await execute(onActionEvent, scope);
    } finally {
      setRunCount((c) => c - 1);
    }
  };
  useGraphicRefRegistration(cid, ref);

  return (
    <div
      className={`${classes} ${runCount > 0 ? "loading-outline" : ""}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#fff",
        ...style,
      }}
    >
      <button
        onClick={(event) => {
          ref.current.action({ $$event: event });
        }}
      >
        {btnLabel || "Action"}
      </button>
      {children}
    </div>
  );
}
