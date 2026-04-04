import {
  Stack,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import {
  useGraphicDataName,
  useWorkspaceSelectedComponent,
  useGraphicData,
  useGraphicDataDescription,
  useGraphicEditorContext
} from "@hooks/editor";

export default function GraphicEditorMenuInfo() {
  const { selectedCid } = useWorkspaceSelectedComponent();
  const { data } = useGraphicData(selectedCid);
  const { name, setName } = useGraphicDataName(selectedCid);
  const { description, setDescription } =
    useGraphicDataDescription(selectedCid);
  const { deleteGraphic, exportGraphicPiece, bringComponentToBack, bringComponentToFront } = useGraphicEditorContext();

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

      <Stack direction={"column"} gap={0.5} mt={1}>
        {
          selectedCid && (
            <>
              <Stack direction={"row"} gap={1}>
                <Button variant="outlined" size="small"
                  sx={{
                    textTransform: 'none',
                    fontSize: '12px',
                    padding: '4px 10px',
                    width: 150
                  }}
                  onClick={() => { exportGraphicPiece(selectedCid) }}
                >
                  Export graphic piece
                </Button>
                <Button variant="outlined" size="small" color="error"
                  sx={{
                    textTransform: 'none',
                    fontSize: '12px',
                    padding: '4px 10px',
                    width: 150
                  }}
                  onClick={() => { deleteGraphic(selectedCid) }}
                >Delete element
                </Button>
              </Stack>
              <Stack direction={"row"} gap={1}>
                <Button variant="outlined" size="small"
                  sx={{
                    textTransform: 'none',
                    fontSize: '12px',
                    padding: '4px 10px',
                    width: 150
                  }}
                  onClick={() => { bringComponentToBack(selectedCid) }}
                >
                  Bring to back
                </Button>
                <Button variant="outlined" size="small"
                  sx={{
                    textTransform: 'none',
                    fontSize: '12px',
                    padding: '4px 10px',
                    width: 150
                  }}
                  onClick={() => { bringComponentToFront(selectedCid) }}
                >
                  Bring to front
                </Button>
              </Stack>
            </>
          )
        }
      </Stack>
    </Stack>
  );
}
