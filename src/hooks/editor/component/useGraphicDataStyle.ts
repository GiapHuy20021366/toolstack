import { CSSProperties } from "react";
import useGraphicState from "../state/useGraphicState";

export default function useGraphicDataStyle(cid: string) {
  const [style, setStyle] = useGraphicState<CSSProperties>(
    cid,
    "data.style",
    {},
  );
  return {
    style: style,
    setStyle: setStyle,
  };
}
