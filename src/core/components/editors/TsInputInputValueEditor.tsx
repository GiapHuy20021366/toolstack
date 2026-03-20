import useGraphicStateValue from "../../hooks/editor/state/useGraphicStateValue";
import useTsComponentStateIn from "../../hooks/editor/state/useGraphicStateValueIn";
import { INativeStateProps } from "../../manager/component-manager";

export interface ITsInputInputValueEditorProps extends INativeStateProps<{
  inputTypeKey: string;
}> {}

export default function TsInputInputValueEditor({
  cid,
  state,
  options,
}: ITsInputInputValueEditorProps) {
  const [type, _setType] = useGraphicStateValue(
    cid,
    options?.inputTypeKey ?? `${cid}_${state.name}_type`,
    "text",
  );
  const [value, setValue] = useGraphicStateValue(cid, state.name, "");
  const [valueIn, _setValueIn] = useTsComponentStateIn(cid, state.name, "");

  return (
    <input
      type={type}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      disabled={state.editable === false || valueIn !== ""}
    />
  );
}
