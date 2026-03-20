import useGraphicStateValue from "../../hooks/editor/state/useGraphicStateValue";
import useTsComponentStateIn from "../../hooks/editor/state/useGraphicStateValueIn";
import { INativeStateProps } from "../../manager/component-manager";

export interface ITsInputCheckboxValueCheckProps extends INativeStateProps<unknown> {}

export default function TsInputCheckboxValueCheck({
  cid,
  state,
}: ITsInputCheckboxValueCheckProps) {
  const [value, setValue] = useGraphicStateValue(cid, state.name, false);
  const [valueIn, _setValueIn] = useTsComponentStateIn(cid, state.name, "");

  return (
    <input
      type={"checkbox"}
      checked={value}
      onChange={(event) => setValue(event.target.checked)}
      disabled={state.editable === false || valueIn !== ""}
    />
  );
}
