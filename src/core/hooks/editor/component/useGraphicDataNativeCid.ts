import useGraphicState from "../state/useGraphicState";

export default function useGraphicDataNativeCid(cid: string) {
  const [nativeCid, setNativeCid] = useGraphicState<string>(
    cid,
    "data.native-cid",
    "",
  );
  return {
    nativeCid: nativeCid,
    setNativeCid: setNativeCid,
  };
}
