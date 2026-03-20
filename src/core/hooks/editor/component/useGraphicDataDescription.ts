import useGraphicState from "../state/useGraphicState";

export default function useGraphicDataDescription(cid: string) {
  const [description, setDescription] = useGraphicState<string>(
    cid,
    "data.description",
    "",
  );
  return {
    description: description,
    setDescription: setDescription,
  };
}
