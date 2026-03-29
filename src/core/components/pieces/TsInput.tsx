import useGraphicDataClasses from "../../hooks/editor/component/useGraphicDataClasses";
import useGraphicDataStyle from "../../hooks/editor/component/useGraphicDataStyle";
import useGraphicStateValue from "../../hooks/editor/state/useGraphicStateValue";

interface IProps {
  cid: string;
}
export default function TsInput({ cid }: IProps) {
  const [type, _setType] = useGraphicStateValue(cid, "type", "text");
  const [value, setValue] = useGraphicStateValue(cid, "value", "");
  const { classes } = useGraphicDataClasses(cid);
  const { style } = useGraphicDataStyle(cid);

  return (
    <input
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        ...style
      }}
      type={type}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      className={classes}
    />
  );
}
