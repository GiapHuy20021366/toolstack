import { Box } from "@mui/material";
import { useGraphicEditorContext } from "@hooks/editor";
import GraphicEditorMenuTreeRow from "./GraphicEditorMenuTreeRow";

export default function GraphicEditorMenuTree() {
  const { cid } = useGraphicEditorContext();
  return (
    <Box
      sx={{
        width: 400,
      }}
    >
      <GraphicEditorMenuTreeRow cid={cid} />
    </Box>
  );
}
