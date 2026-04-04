import useGraphicState from "../state/useGraphicState";

export default function useGraphicDataVisible(cid: string) {
  const [visible, setVisible] = useGraphicState<boolean>(
    cid,
    "data.visible",
    true,
  );
  return {
    visible: visible,
    setVisible: setVisible,
  };
}
