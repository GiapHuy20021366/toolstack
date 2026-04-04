import { useGraphicStateValue, useGraphicStateValueIn } from "@hooks/editor";
import { INativeStateProps } from "@contexts/editor";

export interface ITsInputTextEditorProps extends INativeStateProps<unknown> { }

export default function TsInputTextEditor({
  cid,
  state,
}: ITsInputTextEditorProps) {
  const [value, setValue] = useGraphicStateValue(cid, state.name, "");
  const [valueIn, _setValueIn] = useGraphicStateValueIn(cid, state.name, "");

  return (
    <input
      type={"text"}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      disabled={state.editable === false || valueIn !== ""}
    />
  );
}
