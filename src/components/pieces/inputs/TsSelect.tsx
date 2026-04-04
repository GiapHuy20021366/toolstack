/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGraphicDataClasses,
  useGraphicDataStyle,
  useGraphicStateValue,
  useFuncExecutor
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
  const [onChangeEvent] = useGraphicStateValue<IFuncState>(cid, "on-change", getDefaultFuncStateValue());
  const [options] = useGraphicStateValue<unknown[]>(cid, "options", []);
  const { classes } = useGraphicDataClasses(cid);
  const { style } = useGraphicDataStyle(cid);

  const { execute } = useFuncExecutor();

  return (
    <select
      style={{
        width: "100%",
        height: "100%",
        ...style
      }}
      className={classes}
      value={JSON.stringify(value)}
      onChange={(e) => {
        try {
          setValue(JSON.parse(e.target.value));
        } catch {
          setValue(e.target.value);
        }
        execute(onChangeEvent, {
          $$event: e
        });
      }}
    >
      {options.map((option, index) => {
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
