import useGraphicEditorContext from "../useGraphicEditorContext";
import useGraphicState from "../state/useGraphicState";

export default function useGraphicDataRoot() {
  const { cid } = useGraphicEditorContext();
  const [data] = useGraphicState<unknown>(cid, "data", null);
  return {
    data: data,
    hasData: data != null,
  };
}
