import useGraphicState from "../state/useGraphicState";

export default function useGraphicDataChildren(cid: string) {
  const [children, setChildren] = useGraphicState<
    string[] | undefined
  >(cid, "data.children", []);
  return {
    children: children,
    setChildren: setChildren,
  };
}
