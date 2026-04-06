import React from "react";
import useGraphicDataClasses from "@hooks/editor/component/useGraphicDataClasses";
import { useGraphicStateStyle } from "@hooks/editor";

interface IProps {
  cid: string;
  children?: React.ReactNode;
}

export default function TsContainer({ cid, children }: IProps) {
  const { classes } = useGraphicDataClasses(cid);
  const { style } = useGraphicStateStyle(cid, false);

  return (
    <div className={classes} style={{ ...style, width: "100%", height: "100%" }}>
      {children}
    </div>
  );
}
