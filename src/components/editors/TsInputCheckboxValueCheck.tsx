import { useGraphicStateValue, useGraphicStateValueIn } from "@hooks/editor";
import { INativeStateProps } from "@contexts/editor";

export interface ITsInputCheckboxValueCheckProps extends INativeStateProps<unknown> { }

export default function TsInputCheckboxValueCheck({
  cid,
  state,
}: ITsInputCheckboxValueCheckProps) {
  const [value, setValue] = useGraphicStateValue(cid, state.name, false);
  const [valueIn, _setValueIn] = useGraphicStateValueIn(cid, state.name, "");

  return (
    <input
      type={"checkbox"}
      checked={value}
      onChange={(event) => setValue(event.target.checked)}
      disabled={state.editable === false || valueIn !== ""}
    />
  );
}
