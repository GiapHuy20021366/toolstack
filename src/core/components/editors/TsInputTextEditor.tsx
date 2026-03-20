import useGraphicStateValue from "../../hooks/editor/state/useGraphicStateValue";
import useTsComponentStateIn from "../../hooks/editor/state/useGraphicStateValueIn";
import { INativeStateProps } from "../../manager/component-manager";

export interface ITsInputTextEditorProps extends INativeStateProps<unknown> {}

export default function TsInputTextEditor({
  cid,
  state,
}: ITsInputTextEditorProps) {
  const [value, setValue] = useGraphicStateValue(cid, state.name, "");
  const [valueIn, _setValueIn] = useTsComponentStateIn(cid, state.name, "");

  return (
    <input
      type={"text"}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      disabled={state.editable === false || valueIn !== ""}
    />
  );
}
