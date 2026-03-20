import useGraphicDataClasses from "../../hooks/editor/component/useGraphicDataClasses";
import useGraphicStateValue from "../../hooks/editor/state/useGraphicStateValue";

interface IProps {
  cid: string;
}
export default function TsInput({ cid }: IProps) {
  const [type, _setType] = useGraphicStateValue(cid, "type", "text");
  const [value, setValue] = useGraphicStateValue(cid, "value", "");
  const { classes } = useGraphicDataClasses(cid);

  return (
    <input
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
      }}
      type={type}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      className={classes}
    />
  );
}
