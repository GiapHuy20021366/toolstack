import useGraphicStateValue from "../../hooks/editor/state/useGraphicStateValue";
import { INativeStateProps } from "../../manager/component-manager";

export interface ITsInputInputTypeSelectorProps extends INativeStateProps<unknown> {}

const INPUT_TYPES = [
  "button",
  "checkbox",
  "color",
  "date",
  "datetime-local",
  "email",
  "file",
  "hidden",
  "image",
  "month",
  "number",
  "password",
  "radio",
  "range",
  "reset",
  "search",
  "submit",
  "tel",
  "text",
  "time",
  "url",
  "week",
] as const;

type InputType = (typeof INPUT_TYPES)[number];

export default function TsInputInputTypeSelector({
  cid,
  state,
}: ITsInputInputTypeSelectorProps) {
  const [type, setType] = useGraphicStateValue<InputType>(
    cid,
    state.name,
    "text",
  );

  return (
    <select
      value={type}
      onChange={(event) => setType(event.target.value as InputType)}
    >
      {INPUT_TYPES.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  );
}
