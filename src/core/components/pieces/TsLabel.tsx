import { useState, useRef, useEffect } from "react";
import useGraphicStateValue from "../../hooks/editor/state/useGraphicStateValue";
import useGraphicDataClasses from "../../hooks/editor/component/useGraphicDataClasses";

interface IProps {
  cid: string;
}

export default function TsLabel({ cid }: IProps) {
  const [label, setLabel] = useGraphicStateValue(cid, "label", "Label");
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { classes } = useGraphicDataClasses(cid);

  // auto focus khi vào edit mode
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  if (editing) {
    return (
      <input
        ref={inputRef}
        style={{
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          margin: 0,
        }}
        value={label || ""}
        onChange={(e) => setLabel(e.target.value)}
        onBlur={() => setEditing(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter") setEditing(false);
          if (e.key === "Escape") setEditing(false);
        }}
      />
    );
  }

  return (
    <span
      style={{
        display: "inline-block",
        width: "100%",
        height: "100%",
        cursor: "text",
      }}
      className={classes}
      onClick={() => setEditing(true)}
    >
      {label || "Label"}
    </span>
  );
}
