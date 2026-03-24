import { Box } from "@mui/material";
import useGraphicDataRoot from "../hooks/editor/component/useGraphicDataRoot";
import useGraphicEditorContext from "./useGraphicEditorContext";
import GraphicRenderer from "./GraphicRenderer";
import useWorkspaceLayout from "../hooks/editor/workspace/useWorkspaceLayout";

export default function GraphicEditorMainGraphicArea() {
  const { cid } = useGraphicEditorContext();
  const { hasData } = useGraphicDataRoot();
  const { scale, width, height } = useWorkspaceLayout();

  const realScale = scale / 100;

  return (
    <Box
      className="scroll-bar"
      sx={{
        maxWidth: "100%",
        maxHeight: "100%",
        height: "100%",
        outline: "1px solid red",
        position: "relative",
        overflow: "auto",
      }}
    >
      {/* Wrapper:  layout + scrollbar */}
      <Box
        sx={{
          width: width * realScale,
          height: height * realScale,
          position: "relative",
        }}
      >
        {/* Inner: scale visual */}
        <Box
          id="graphic-area"
          container-cid={!hasData ? cid : undefined}
          sx={{
            width: width,
            height: height,
            transform: `scale(${realScale})`,
            transformOrigin: "top left",
            outline: "1px solid green",
          }}
        >
          <GraphicRenderer cid={cid} />
        </Box>
      </Box>
    </Box>
  );
}
