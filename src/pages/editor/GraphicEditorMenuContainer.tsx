import { Stack } from "@mui/material";
import { EGraphicEditorTabMenu } from "@data/editor";
import GraphicEditorMenuTree from "./GraphicEditorMenuTree";
import GraphicEditorMenuState from "./GraphicEditorMenuState";
import GraphicEditorMenuComponent from "./GraphicEditorMenuComponent";
import { useWorkspaceRightTab } from "@hooks/editor";
import GraphicEditorMenuLayout from "./GraphicEditorMenuLayout";
import GraphicEditorMenuInfo from "./GraphicEditorMenuInfo";

export default function GraphicEditorMenuContainer() {
  const { selectedTab } = useWorkspaceRightTab();

  return (
    <Stack
      sx={{
        width: "fit-content",
        height: "100%",
        overflowY: "auto",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        transform: "translateX(-100%)",
        zIndex: 11,
        backgroundColor: "#ffffff",
        boxShadow: 2,
      }}
    >
      {selectedTab === EGraphicEditorTabMenu.TREE_MENU && (
        <GraphicEditorMenuTree />
      )}
      {selectedTab === EGraphicEditorTabMenu.COMPONENT_STATE_MENU && (
        <GraphicEditorMenuState />
      )}
      {selectedTab === EGraphicEditorTabMenu.COMPONENT_MENU && (
        <GraphicEditorMenuComponent />
      )}
      {selectedTab === EGraphicEditorTabMenu.COMPONENT_LAYOUT_MENU && (
        <GraphicEditorMenuLayout />
      )}
      {selectedTab === EGraphicEditorTabMenu.COMPONENT_INFO_MENU && (
        <GraphicEditorMenuInfo />
      )}
    </Stack>
  );
}
