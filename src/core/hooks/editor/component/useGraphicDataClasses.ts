import useGraphicState from "../state/useGraphicState";

export default function useGraphicDataClasses(cid: string) {
  const [classes, setClasses] = useGraphicState<string>(
    cid,
    "data.classes",
    "",
  );
  return {
    classes: classes,
    setClasses: setClasses,
  };
}
