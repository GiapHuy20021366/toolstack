import {
  useGraphicDataClasses,
  useGraphicStateValue,
  useFuncExecutor,
  useGraphicStateStyle,
} from "@hooks/editor";
import { IFuncState } from "@contexts/editor";
import { getDefaultFuncStateValue } from "@contexts/editor";

interface IProps {
  cid: string;
}
export default function TsButton({ cid }: IProps) {
  const [value, _setValue] = useGraphicStateValue(cid, "value", "");
  const [text, _setText] = useGraphicStateValue(cid, "text", "");
  const { classes } = useGraphicDataClasses(cid);
  const { style } = useGraphicStateStyle(cid, false);
  const [onClickEvent] = useGraphicStateValue<IFuncState>(
    cid,
    "on-click",
    getDefaultFuncStateValue(),
  );

  const { execute } = useFuncExecutor();

  return (
    <button
      style={{
        ...style,
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      value={value}
      onClick={(event) => {
        execute(
          onClickEvent,
          { $$event: event },
          {
            actionName: "on-click",
            cid: cid,
          },
        );
      }}
      className={classes}
    >
      {text || "Button"}
    </button>
  );
}
