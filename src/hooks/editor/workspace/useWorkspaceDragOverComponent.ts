import useWorkspaceState from "../state/useWorkspaceState";

export default function useWorkspaceDragOverComponent() {
  const [dragoverCid, setDragoverCid] = useWorkspaceState(
    "temp.dragover.cid",
    "",
  );
  return {
    dragoverCid: dragoverCid,
    setDragoverCid: setDragoverCid,
  };
}
