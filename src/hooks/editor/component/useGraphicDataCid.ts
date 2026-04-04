import useGraphicState from "../state/useGraphicState";

export default function useGraphicDataCid(cid: string) {
  const [id, setId] = useGraphicState<string>(cid, "data.cid", "");
  return {
    cid: id,
    setCid: setId,
  };
}
