import {
  useGraphicDataClasses,
  useGraphicStateValue,
  useFuncExecutor,
  useGraphicStateStyle,
} from "@hooks/editor";
import { getDefaultFuncStateValue, IFuncState } from "@contexts/editor";

interface IProps {
  cid: string;
}
export default function TsInput({ cid }: IProps) {
  const [type, _setType] = useGraphicStateValue(cid, "type", "text");
  const [value, setValue] = useGraphicStateValue(cid, "value", "");
  const { classes } = useGraphicDataClasses(cid);
  const { style } = useGraphicStateStyle(cid, false);
  const [onChangeEvent] = useGraphicStateValue<IFuncState>(
    cid,
    "on-change",
    getDefaultFuncStateValue(),
  );

  const { execute } = useFuncExecutor();

  return (
    <input
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        ...style,
      }}
      type={type}
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
        execute(
          onChangeEvent,
          { $$event: event },
          {
            actionName: "on-change",
            cid: cid,
          },
        );
      }}
      className={classes}
    />
  );
}
