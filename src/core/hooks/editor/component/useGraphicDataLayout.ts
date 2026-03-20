import { ILayoutBounds } from "../../../manager/component-manager";
import useGraphicState from "../state/useGraphicState";

export default function useGraphicDataLayout(cid: string) {
  const [layout, setLayout] = useGraphicState<ILayoutBounds | null>(
    cid,
    "data.layout",
    null,
  );
  return {
    layout: layout,
    setLayout: setLayout,
  };
}
