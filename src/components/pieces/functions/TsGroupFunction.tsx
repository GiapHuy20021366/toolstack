import React, { useRef, useState } from "react";
import {
  useEditorStateContext,
  useGraphicDataClasses,
  useGraphicDataStyle,
  useGraphicRefRegistration,
  useGraphicStateValue,
} from "@hooks/editor";
import { IFuncExecutorContextScope, makeEditorRefKey } from "@contexts/editor";
import { listAllSubFunctions } from "@data/editor";

interface IProps {
  cid: string;
  children?: React.ReactNode;
}

interface IGroupFunctionRef {
  action: (scope: IFuncExecutorContextScope) => Promise<void>;
}

export default function TsGroupFunction({ cid, children }: IProps) {
  const { classes } = useGraphicDataClasses(cid);
  const { style } = useGraphicDataStyle(cid);
  const { stateManager } = useEditorStateContext();

  const [skipError] = useGraphicStateValue<boolean>(cid, "skip-error", false);
  const [parallel] = useGraphicStateValue<boolean>(cid, "parallel", false);

  const [runCount, setRunCount] = useState(0);

  const ref = useRef<IGroupFunctionRef>({
    action: async () => {},
  });

  //  Always update ref and registration
  ref.current.action = async (scope: IFuncExecutorContextScope) => {
    const subFunctions = listAllSubFunctions(stateManager, cid);
    const refs = subFunctions
      .map((cid) => stateManager.getValue(makeEditorRefKey(cid)))
      .filter((ref) => {
        return (
          ref != null &&
          typeof ref === "object" &&
          "action" in ref &&
          typeof ref["action"] === "function"
        );
      }) as IGroupFunctionRef[];
    if (refs.length === 0) {
      return;
    }

    setRunCount((c) => c + 1);
    try {
      if (parallel) {
        await Promise.all(
          refs.map(async (ref) => {
            try {
              await ref.action(scope);
            } catch (error) {
              if (!skipError) {
                throw error;
              }
            }
          }),
        );
      } else {
        for (const ref of refs) {
          try {
            await ref.action(scope);
          } catch (error) {
            if (!skipError) {
              throw error;
            }
          }
        }
      }
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
      {children}
    </div>
  );
}
