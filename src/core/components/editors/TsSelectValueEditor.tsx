import useGraphicStateValue from "../../hooks/editor/state/useGraphicStateValue";
import { INativeStateProps } from "../../manager/component-manager";

export interface ITsSelectValueEditorOption {
  value: string;
  text: string;
}
export interface ITsSelectValueEditorProps extends INativeStateProps<{
  options: ITsSelectValueEditorOption[];
  defaultValue?: string;
}> { }

export default function TsSelectValueEditor({
  cid,
  state,
  options
}: ITsSelectValueEditorProps) {
  const [value, setValue] = useGraphicStateValue<string | undefined>(
    cid,
    state.name,
    options?.defaultValue,
  );

  return (
    <select
      value={value}
      onChange={(event) => setValue(event.target.value)}
    >
      {(options?.options || []).map((t) => (
        <option key={t.value} value={t.value}>
          {t.text}
        </option>
      ))}
    </select>
  );
}
