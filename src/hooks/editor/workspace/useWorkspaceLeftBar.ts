import useWorkspaceState from "../state/useWorkspaceState";

export default function useWorkspaceLeftBar() {
  const [open, setOpen] = useWorkspaceState("left.bar.open", true);
  return {
    open: open,
    setOpen: setOpen,
  };
}
