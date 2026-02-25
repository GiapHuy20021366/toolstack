import useTsComponentState from "../../hook/useTsComponentState";
import useTsComponentStateIn from "../../hook/useTsComponentStateIn";
import { ITsStateProps } from "../../manager/component-manager";

export interface ITsInputInputValueEditorProps extends ITsStateProps<{
  inputTypeKey: string;
}> {}

export default function TsInputInputValueEditor({
  cid,
  state,
  options,
}: ITsInputInputValueEditorProps) {
  const [type, _setType] = useTsComponentState(
    cid,
    options?.inputTypeKey ?? `${cid}_${state.name}_type`,
    "text",
  );
  const [value, setValue] = useTsComponentState(cid, state.name, "");
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
