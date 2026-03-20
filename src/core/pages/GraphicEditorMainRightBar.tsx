import {
  AccountTreeOutlined,
  AddOutlined,
  BorderColorOutlined,
  BrandingWatermarkOutlined,
  InfoOutlined,
} from "@mui/icons-material";
import { Stack, Tooltip } from "@mui/material";
import { EGraphicEditorTabMenu } from "./data";
import useWorkspaceRightTab from "../hooks/editor/workspace/useWorkspaceRightTab";

export default function GraphicEditorMainRightBar() {
  const { selectedTab, setSelectedTab } = useWorkspaceRightTab();

  const changeTab = (value: EGraphicEditorTabMenu) => {
    if (selectedTab === value) {
      setSelectedTab(null);
    } else {
      setSelectedTab(value);
    }
  };
  return (
    <Stack
      direction={"column"}
      gap={1}
      sx={{
        boxShadow: 1,
        height: "100%",
      }}
    >
      {/* Component menu */}
      <Tooltip title="Component menu" placement="left-start" arrow>
        <AddOutlined
          color={
            selectedTab === EGraphicEditorTabMenu.COMPONENT_MENU
              ? "primary"
              : "inherit"
          }
          onClick={() => changeTab(EGraphicEditorTabMenu.COMPONENT_MENU)}
        />
      </Tooltip>

      {/* Container tree */}
      <Tooltip title="Tree menu" placement="left-start" arrow>
        <AccountTreeOutlined
          color={
            selectedTab === EGraphicEditorTabMenu.TREE_MENU
              ? "primary"
              : "inherit"
          }
          onClick={() => changeTab(EGraphicEditorTabMenu.TREE_MENU)}
        />
      </Tooltip>

      {/* Component state */}
      <Tooltip title="State menu" placement="left-start" arrow>
        <BorderColorOutlined
          color={
            selectedTab === EGraphicEditorTabMenu.COMPONENT_STATE_MENU
              ? "primary"
              : "inherit"
          }
          onClick={() => changeTab(EGraphicEditorTabMenu.COMPONENT_STATE_MENU)}
        />
      </Tooltip>

      {/* Component layout */}
      <Tooltip title="Layout menu" placement="left-start" arrow>
        <BrandingWatermarkOutlined
          color={
            selectedTab === EGraphicEditorTabMenu.COMPONENT_LAYOUT_MENU
              ? "primary"
              : "inherit"
          }
          onClick={() => changeTab(EGraphicEditorTabMenu.COMPONENT_LAYOUT_MENU)}
        />
      </Tooltip>

      {/* Component info */}
      <Tooltip title="Info menu" placement="left-start" arrow>
        <InfoOutlined
          color={
            selectedTab === EGraphicEditorTabMenu.COMPONENT_INFO_MENU
              ? "primary"
              : "inherit"
          }
          onClick={() => changeTab(EGraphicEditorTabMenu.COMPONENT_INFO_MENU)}
        />
      </Tooltip>
    </Stack>
  );
}
