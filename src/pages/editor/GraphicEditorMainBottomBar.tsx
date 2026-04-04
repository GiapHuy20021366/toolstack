import { Box, Stack } from "@mui/material";
import {
  useLayerList,
  useSelectedLayer,
  useWorkspaceSelectedComponent,
  useWorkspaceLayout
} from "@hooks/editor";
import { SCREEN_RESOLUTIONS } from "@data/editor";

export default function GraphicEditorMainBottomBar() {
  const { layers } = useLayerList("graphic-area");
  const { selectedLayer, setSelectedLayer } = useSelectedLayer();
  const { setSelectedCid } = useWorkspaceSelectedComponent();
  const { scale, setScale, setHeight, setWidth, resolution, setResolution } =
    useWorkspaceLayout();

  return (
    <Stack
      direction={"row"}
      justifyContent={"center"}
      sx={{ width: "100%", height: "100%" }}
      gap={1}
    >
      <Box>
        <label htmlFor="select-resolution">Resolution: </label>
        <select
          id="select-resolution"
          value={resolution}
          onChange={(e) => {
            const rsId = e.target.value;
            setResolution(rsId);
            if (rsId !== "custom") {
              const rs = SCREEN_RESOLUTIONS.find(
                (rs) => rs.id === e.target.value,
              );
              if (rs != null) {
                setWidth(rs.width);
                setHeight(rs.height);
              }
            }
          }}
          style={{ width: "150px" }}
        >
          {SCREEN_RESOLUTIONS.map((resolution) => (
            <option key={resolution.id} value={resolution.id}>
              {resolution.name}
            </option>
          ))}
        </select>
      </Box>
      <Box>
        <label htmlFor="scale-input">Scale: </label>
        <input
          type="number"
          min={20}
          max={200}
          step={1}
          value={scale}
          onChange={(e) => setScale(+e.target.value)}
        />
      </Box>
      <Box>
        <label htmlFor="select-layer">Layer: </label>
        <select
          id="select-layer"
          value={selectedLayer}
          onChange={(e) => {
            setSelectedLayer(e.target.value);
            setSelectedCid(e.target.value);
          }}
          style={{ width: "100px" }}
        >
          <option value="">Screen</option>
          {layers.map((layer) => (
            <option key={layer.cid} value={layer.cid}>
              {layer.name || layer.cid}
            </option>
          ))}
        </select>
      </Box>
    </Stack>
  );
}
