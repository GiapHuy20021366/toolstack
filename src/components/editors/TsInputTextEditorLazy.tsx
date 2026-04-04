import { useEffect, useRef } from "react";
import { useGraphicStateValue, useGraphicStateValueIn } from "@hooks/editor";
import { INativeStateProps } from "@contexts/editor";

export interface ITsInputTextEditorLazyProps extends INativeStateProps<unknown> { }

export default function TsInputTextEditorLazy({
  cid,
  state,
}: ITsInputTextEditorLazyProps) {
  const [value, setValue] = useGraphicStateValue<unknown>(
    cid,
    state.name,
    state.defaultValue,
  );
  const [valueIn, _setValueIn] = useGraphicStateValueIn(cid, state.name, "");

  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (element != null) {
      element.value = state.encoder ? state.encoder(value) : String(value);
    }
  }, [state, value]);

  return (
    <input
      ref={ref}
      type={"text"}
      defaultValue={state.encoder ? state.encoder(value) : String(value)}
      disabled={state.editable === false || valueIn !== ""}
      onBlur={(e) => {
        const validator = state.validator;
        if (validator != null && validator(e.target.value) != null) {
          e.target.value = state.encoder ? state.encoder(value) : String(value);
          return;
        } else {
          setValue(
            state.decoder ? state.decoder(e.target.value) : e.target.value,
          );
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && ref.current) {
          const validator = state.validator;
          if (validator != null && validator(ref.current.value) != null) {
            ref.current.value = state.encoder
              ? state.encoder(value)
              : String(value);
            return;
          } else {
            setValue(
              state.decoder
                ? state.decoder(ref.current.value)
                : ref.current.value,
            );
          }
        }
      }}
    />
  );
}
