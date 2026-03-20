import { Box, Stack } from "@mui/material";
import useGraphicEditorContext from "./useGraphicEditorContext";
import GraphicRenderer from "./GraphicRenderer";
import GraphicEditorMainTopBar from "./GraphicEditorMainTopBar";
import GraphicEditorMainRightBar from "./GraphicEditorMainRightBar";
import GraphicEditorMenuContainer from "./GraphicEditorMenuContainer";
import useWorkspaceRightBar from "../hooks/editor/workspace/useWorkspaceRightBar";
import useWorkspaceLeftBar from "../hooks/editor/workspace/useWorkspaceLeftBar";
import useGraphicDataRoot from "../hooks/editor/component/useGraphicDataRoot";

export default function GraphicEditorMain() {
  const { cid } = useGraphicEditorContext();
  const { open: rightBarOpen } = useWorkspaceRightBar();
  const { open: leftBarOpen } = useWorkspaceLeftBar();
  const { hasData } = useGraphicDataRoot();

  return (
    <Stack
      direction={"column"}
      sx={{
        width: "100vw",
        height: "100vh",
        boxSizing: "border-box",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      {/* Top Bar */}
      <Stack direction={"row"}>
        <GraphicEditorMainTopBar />
      </Stack>

      {/* Center */}
      <Stack direction={"row"} sx={{ flex: 1, width: "100vw" }}>
        {/* Left Bar */}
        {leftBarOpen && (
          <Stack direction={"column"} sx={{ width: "30px" }}></Stack>
        )}

        {/* Graphic Area */}
        <Box
          container-cid={!hasData ? cid : undefined}
          data-layout-x={0}
          data-layout-y={0}
          sx={{ flex: 1, border: "1px solid red", position: "relative" }}
        >
          <GraphicRenderer cid={cid} />
        </Box>

        {/* Right Bar */}
        {rightBarOpen && (
          <Stack direction={"column"} sx={{ position: "relative" }}>
            <GraphicEditorMainRightBar />
            <GraphicEditorMenuContainer />
          </Stack>
        )}
      </Stack>

      {/* Bottom Bar */}
      <Stack direction={"row"} sx={{ height: "30px" }}></Stack>
    </Stack>
  );
}
