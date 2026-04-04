import useWorkspaceState from "../state/useWorkspaceState";

export default function useWorkspaceRightBar() {
  const [open, setOpen] = useWorkspaceState("right.bar.open", true);
  return {
    open: open,
    setOpen: setOpen,
  };
}
