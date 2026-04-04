import { Box } from "@mui/material";
import {
  useGraphicDataRoot,
  useGraphicEditorContext,
  useWorkspaceLayout,
  useWorkspaceClipboardOperations
} from "@hooks/editor";
import GraphicRenderer from "./GraphicRenderer";

export default function GraphicEditorMainGraphicArea() {
  const { cid } = useGraphicEditorContext();
  const { hasData } = useGraphicDataRoot();
  const { scale, width, height } = useWorkspaceLayout();

  const realScale = scale / 100;

  // Copy, paste, cut operation
  useWorkspaceClipboardOperations("graphic-area");

  return (
    <Box
      className="scroll-bar"
      sx={{
        maxWidth: "100%",
        maxHeight: "100%",
        height: "100%",
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
          tabIndex={0}
          container-cid={!hasData ? cid : undefined}
          sx={{
            width: width,
            height: height,
            transform: `scale(${realScale})`,
            transformOrigin: "top left",
          }}
        >
          <GraphicRenderer cid={cid} />
        </Box>
      </Box>
    </Box>
  );
}
