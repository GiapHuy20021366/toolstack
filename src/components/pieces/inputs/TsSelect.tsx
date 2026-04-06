/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGraphicDataClasses,
  useGraphicStateValue,
  useFuncExecutor,
  useGraphicStateStyle,
} from "@hooks/editor";
import { getDefaultFuncStateValue, IFuncState } from "@contexts/editor";
import { resolvePath } from "@utils";

interface IProps {
  cid: string;
}

export default function TsSelect({ cid }: IProps) {
  const [value, setValue] = useGraphicStateValue(cid, "value", "");
  const [valueKey] = useGraphicStateValue(cid, "value-key", "$$index");
  const [textKey] = useGraphicStateValue(cid, "text-key", "$$option");
  const [onChangeEvent] = useGraphicStateValue<IFuncState>(
    cid,
    "on-change",
    getDefaultFuncStateValue(),
  );
  const [options] = useGraphicStateValue<unknown[] | undefined>(
    cid,
    "options",
    [],
  );
  const { classes } = useGraphicDataClasses(cid);
  const { style } = useGraphicStateStyle(cid, false);

  const { execute } = useFuncExecutor();

  return (
    <select
      style={{
        width: "100%",
        height: "100%",
        ...style,
      }}
      className={classes}
      value={JSON.stringify(value)}
      onChange={(e) => {
        try {
          setValue(JSON.parse(e.target.value));
        } catch {
          setValue(e.target.value);
        }
        execute(
          onChangeEvent,
          {
            $$event: e,
          },
          {
            actionName: "on-change",
            cid: cid,
          },
        );
      }}
    >
      {(options ?? []).map((option, index) => {
        const scope = {
          $$index: index,
          $$option: option,
        };

        const optionValue = resolvePath(valueKey, scope);
        const optionText = resolvePath(textKey, scope);

        return (
          <option key={index} value={JSON.stringify(optionValue)}>
            {String(optionText ?? "")}
          </option>
        );
      })}
    </select>
  );
}
