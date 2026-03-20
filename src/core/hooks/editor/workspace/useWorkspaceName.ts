import useWorkspaceState from "../state/useWorkspaceState";

export default function useWorkspaceName() {
  const [workspaceName, setWorkspaceName] = useWorkspaceState(
    "info.name",
    "No title",
  );
  return {
    workspaceName: workspaceName,
    setWorkspaceName: setWorkspaceName,
  };
}
