import useGraphicDataClasses from "../../hooks/editor/component/useGraphicDataClasses";
import useGraphicStateValue from "../../hooks/editor/state/useGraphicStateValue";

interface IProps {
  cid: string;
}
export default function TsInputRadio({ cid }: IProps) {
  const [value, setValue] = useGraphicStateValue(cid, "value", true);
  const [name] = useGraphicStateValue(cid, "name", "");
  const { classes } = useGraphicDataClasses(cid);

  return (
    <input
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        margin: 0,
      }}
      name={name}
      className={classes}
      type={"radio"}
      checked={value}
      onChange={(event) => setValue(event.target.checked)}
    />
  );
}
