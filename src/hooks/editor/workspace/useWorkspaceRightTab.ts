import { EGraphicEditorTabMenu } from "@data/editor";
import useWorkspaceState from "../state/useWorkspaceState";

export default function useWorkspaceRightTab() {
  const [selected, setSelected] =
    useWorkspaceState<EGraphicEditorTabMenu | null>("selected.tab", null);
  return {
    selectedTab: selected,
    setSelectedTab: setSelected,
  };
}
