import React from "react";
import useGraphicDataClasses from "@hooks/editor/component/useGraphicDataClasses";
import useGraphicDataStyle from "@hooks/editor/component/useGraphicDataStyle";

interface IProps {
  cid: string;
  children?: React.ReactNode;
}

export default function TsContainer({ cid, children }: IProps) {
  const { classes } = useGraphicDataClasses(cid);
  const { style } = useGraphicDataStyle(cid);

  return (
    <div className={classes} style={{ width: "100%", height: "100%", ...style }}>
      {children}
    </div>
  );
}
