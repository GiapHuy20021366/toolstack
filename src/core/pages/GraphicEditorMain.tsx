import { Box, Stack } from "@mui/material";
import useGraphicEditorContext from "./useGraphicEditorContext";
import GraphicRenderer from "./GraphicRenderer";
import GraphicEditorMainTopBar from "./GraphicEditorMainTopBar";
import GraphicEditorMainRightBar from "./GraphicEditorMainRightBar";
import GraphicEditorMenuContainer from "./GraphicEditorMenuContainer";
import useWorkspaceRightBar from "../hooks/editor/workspace/useWorkspaceRightBar";
import useWorkspaceLeftBar from "../hooks/editor/workspace/useWorkspaceLeftBar";
import useGraphicDataRoot from "../hooks/editor/component/useGraphicDataRoot";
import useGraphicLayers from "../hooks/editor/workspace/useLayerList";
import useSelectedLayer from "../hooks/editor/workspace/useSelectedLayer";
import useWorkspaceSelectedComponent from "../hooks/editor/workspace/useWorkspaceSelectedComponent";

export default function GraphicEditorMain() {
  const { cid } = useGraphicEditorContext();
  const { open: rightBarOpen } = useWorkspaceRightBar();
  const { open: leftBarOpen } = useWorkspaceLeftBar();
  const { hasData } = useGraphicDataRoot();

  const { layers } = useGraphicLayers("graphic-area");
  const { selectedLayer, setSelectedLayer } = useSelectedLayer();
  const { setSelectedCid } = useWorkspaceSelectedComponent();

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
        <select
          name=""
          id=""
          value={selectedLayer}
          onChange={(e) => {
            setSelectedLayer(e.target.value);
            setSelectedCid(e.target.value);
          }}
        >
          <option value="">None</option>
          {layers.map((layer) => (
            <option key={layer.cid} value={layer.cid}>
              {layer.name || layer.cid}
            </option>
          ))}
        </select>
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
          id={"graphic-area"}
          container-cid={!hasData ? cid : undefined}
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
