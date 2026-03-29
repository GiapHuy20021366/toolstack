import useGraphicDataClasses from "../../hooks/editor/component/useGraphicDataClasses";
import useGraphicDataStyle from "../../hooks/editor/component/useGraphicDataStyle";
import useGraphicStateValue from "../../hooks/editor/state/useGraphicStateValue";

interface IProps {
  cid: string;
}
export default function TsInputCheckbox({ cid }: IProps) {
  const [value, setValue] = useGraphicStateValue(cid, "value", false);
  const { classes } = useGraphicDataClasses(cid);
  const { style } = useGraphicDataStyle(cid);

  return (
    <input
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        margin: 0,
        ...style
      }}
      className={classes}
      type={"checkbox"}
      checked={value}
      onChange={(event) => setValue(event.target.checked)}
    />
  );
}
