import useWorkspaceState from "../state/useWorkspaceState";

export default function useWorkspaceSelectedComponent() {
  const [selectedCid, setSelectedCid] = useWorkspaceState(
    "temp.selected-cid",
    "",
  );
  return {
    selectedCid: selectedCid,
    setSelectedCid: setSelectedCid,
  };
}
