import { IGraphicComponentData } from "../../../manager/component-manager";
import useGraphicState from "../state/useGraphicState";

export default function useGraphicData(cid: string) {
  const [data, setData] = useGraphicState<IGraphicComponentData | null>(
    cid,
    "data",
    null,
  );
  return {
    data: data,
    setData: setData,
  };
}
