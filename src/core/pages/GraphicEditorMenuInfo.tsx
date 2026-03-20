import {
  Stack,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

import useGraphicDataName from "../hooks/editor/component/useGraphicDataName";
import useWorkspaceSelectedComponent from "../hooks/editor/workspace/useWorkspaceSelectedComponent";
import useGraphicData from "../hooks/editor/component/useGraphicData";
import useGraphicDataDescription from "../hooks/editor/component/useGraphicDataDescription";

export default function GraphicEditorMenuInfo() {
  const { selectedCid } = useWorkspaceSelectedComponent();
  const { data } = useGraphicData(selectedCid);
  const { name, setName } = useGraphicDataName(selectedCid);
  const { description, setDescription } =
    useGraphicDataDescription(selectedCid);

  if (!selectedCid) {
    return (
      <Stack
        sx={{
          width: 320,
          p: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No component selected
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack
      sx={{
        width: 320,
        p: 1,
      }}
    >
      <Accordion defaultExpanded disableGutters>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle2">Information</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Stack gap={2}>
            {/* Id */}
            <TextField
              label="Id"
              size="small"
              value={selectedCid}
              disabled
              fullWidth
            />

            {/* Native component */}
            <TextField
              label="Component"
              size="small"
              value={data?.nativeCid ?? ""}
              disabled
              fullWidth
            />

            {/* Name */}
            <TextField
              label="Name"
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />

            {/* Description */}
            <TextField
              label="Description"
              size="small"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              minRows={3}
              maxRows={6}
              fullWidth
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}
