import useGraphicState from "../state/useGraphicState";

export default function useGraphicDataName(cid: string) {
  const [name, setName] = useGraphicState<string>(cid, "data.name", "");
  return {
    name: name,
    setName: setName,
  };
}
