/* eslint-disable @typescript-eslint/no-explicit-any */
import get from "lodash/get";
import useGraphicStateValue from "../../hooks/editor/state/useGraphicStateValue";
import useGraphicDataClasses from "../../hooks/editor/component/useGraphicDataClasses";

interface IProps {
  cid: string;
}

function resolvePath(path: string, scope: any) {
  if (!path) return undefined;

  if (path.startsWith("$$")) {
    const match = path.match(/^\$\$(\w+)/);
    if (!match) return undefined;

    const rootKey = match[1];
    const root = scope[`$$${rootKey}`];

    if (path === `$$${rootKey}`) return root;

    const realPath = path.replace(`$$${rootKey}.`, `${rootKey}.`);

    return get({ [rootKey]: root }, realPath);
  }

  // fallback
  return get(scope, path);
}

export default function TsSelect({ cid }: IProps) {
  const [value, setValue] = useGraphicStateValue(cid, "value", "");
  const [valueKey] = useGraphicStateValue(cid, "value-key", "$$index");
  const [textKey] = useGraphicStateValue(cid, "text-key", "$$option");
  const [options] = useGraphicStateValue<unknown[]>(cid, "options", []);
  const { classes } = useGraphicDataClasses(cid);

  return (
    <select
      style={{
        width: "100%",
        height: "100%",
      }}
      className={classes}
      value={JSON.stringify(value)}
      onChange={(e) => {
        try {
          setValue(JSON.parse(e.target.value));
        } catch {
          setValue(e.target.value);
        }
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
