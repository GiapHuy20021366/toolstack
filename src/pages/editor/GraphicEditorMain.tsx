import { Box, Stack } from "@mui/material";
import GraphicEditorMainTopBar from "./GraphicEditorMainTopBar";
import GraphicEditorMainRightBar from "./GraphicEditorMainRightBar";
import GraphicEditorMenuContainer from "./GraphicEditorMenuContainer";
import GraphicEditorMainBottomBar from "./GraphicEditorMainBottomBar";
import GraphicEditorMainGraphicArea from "./GraphicEditorMainGraphicArea";
import {
  useWorkspaceRightBar,
  useWorkspaceLeftBar,
  useWorkspaceMode,
} from "@hooks/editor";
import { EGraphicEditorWorkspaceMode } from "@data/editor";

export default function GraphicEditorMain() {
  const { open: rightBarOpen } = useWorkspaceRightBar();
  const { open: leftBarOpen } = useWorkspaceLeftBar();
  const { mode } = useWorkspaceMode();

  const containerClassName = [
    "graphic-main",
    (mode === EGraphicEditorWorkspaceMode.EDIT && "edit-mode") || "",
    (mode === EGraphicEditorWorkspaceMode.VIEW && "view-mode") || "",
  ].join(" ");

  return (
    <Stack
      direction={"column"}
      sx={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
      className={containerClassName}
    >
      {/* Top Bar */}
      <Stack direction={"row"}>
        <GraphicEditorMainTopBar />
      </Stack>

      {/* Center */}
      <Stack direction={"row"} sx={{ flex: 1, width: "100%", height: 0 }}>
        {/* Left Bar */}
        {leftBarOpen && (
          <Stack
            direction={"column"}
            sx={{ width: "30px", boxShadow: 1 }}
          ></Stack>
        )}

        {/* Graphic Area */}
        <Box sx={{ flex: 1, width: 0 }}>
          <GraphicEditorMainGraphicArea />
        </Box>

        {/* Right Bar */}
        {rightBarOpen && (
          <Stack direction={"row"} sx={{ position: "relative" }}>
            <GraphicEditorMenuContainer />
            <GraphicEditorMainRightBar />
          </Stack>
        )}
      </Stack>

      {/* Bottom Bar */}
      <Stack direction={"row"} sx={{ height: "30px", boxShadow: 2 }}>
        <GraphicEditorMainBottomBar />
      </Stack>
    </Stack>
  );
}
