import { EGraphicEditorWorkspaceMode } from "../../../pages/data";
import useWorkspaceState from "../state/useWorkspaceState";

export default function useWorkspaceMode() {
  const [mode, setMode] = useWorkspaceState("mode", EGraphicEditorWorkspaceMode.EDIT);
  return {
    mode: mode,
    setMode: setMode,
  };
}
