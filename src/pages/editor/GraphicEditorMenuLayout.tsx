import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Divider,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

import {
  useWorkspaceSelectedComponent,
  useGraphicDataLayout,
  useGraphicDataVisible,
  useGraphicDataClasses,
} from "@hooks/editor";

export default function GraphicEditorMenuLayout() {
  const { selectedCid } = useWorkspaceSelectedComponent();
  const { layout, setLayout } = useGraphicDataLayout(selectedCid);
  const { visible, setVisible } = useGraphicDataVisible(selectedCid);
  const { classes, setClasses } = useGraphicDataClasses(selectedCid);

  const updateLayout = (
    x: number,
    y: number,
    width: number,
    height: number,
  ) => {
    if (!layout) return;
    if (x < 0 || y < 0 || width < 0 || height < 0) return;

    if (layout.minWidth != null && width < layout.minWidth) return;
    if (layout.maxWidth != null && width > layout.maxWidth) return;
    if (layout.minHeight != null && height < layout.minHeight) return;
    if (layout.maxHeight != null && height > layout.maxHeight) return;

    setLayout({ ...layout, x, y, width, height });
  };

  return (
    <Stack
      sx={{
        width: 320,
        p: 1,
        gap: 1,
      }}
    >
      {/* Layout */}
      {layout && (
        <Accordion defaultExpanded disableGutters>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle2">Layout</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Stack gap={2}>
              {/* Position */}
              <Stack gap={1}>
                <Typography variant="caption" color="text.secondary">
                  Position
                </Typography>

                <Stack direction="row" gap={1}>
                  <TextField
                    label="X"
                    size="small"
                    type="number"
                    value={layout.x}
                    onChange={(e) =>
                      updateLayout(
                        +e.target.value,
                        layout.y,
                        layout.width,
                        layout.height,
                      )
                    }
                    inputProps={{ min: 0 }}
                    fullWidth
                  />

                  <TextField
                    label="Y"
                    size="small"
                    type="number"
                    value={layout.y}
                    onChange={(e) =>
                      updateLayout(
                        layout.x,
                        +e.target.value,
                        layout.width,
                        layout.height,
                      )
                    }
                    inputProps={{ min: 0 }}
                    fullWidth
                  />
                </Stack>
              </Stack>

              {/* Size */}
              <Stack gap={1}>
                <Typography variant="caption" color="text.secondary">
                  Size
                </Typography>

                <Stack direction="row" gap={1}>
                  <TextField
                    label="W"
                    size="small"
                    type="number"
                    value={layout.width}
                    onChange={(e) =>
                      updateLayout(
                        layout.x,
                        layout.y,
                        +e.target.value,
                        layout.height,
                      )
                    }
                    inputProps={{
                      min: layout.minWidth,
                      max: layout.maxWidth,
                    }}
                    fullWidth
                  />

                  <TextField
                    label="H"
                    size="small"
                    type="number"
                    value={layout.height}
                    onChange={(e) =>
                      updateLayout(
                        layout.x,
                        layout.y,
                        layout.width,
                        +e.target.value,
                      )
                    }
                    inputProps={{
                      min: layout.minHeight,
                      max: layout.maxHeight,
                    }}
                    fullWidth
                  />
                </Stack>
              </Stack>
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Visibility */}
      {layout != null && (
        <Accordion defaultExpanded disableGutters>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle2">Visibility</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Stack gap={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={visible}
                    onChange={(e) => setVisible(e.target.checked)}
                  />
                }
                label="Visible"
              />

              <Divider />

              <TextField
                label="Classes"
                size="small"
                value={classes}
                onChange={(e) => setClasses(e.target.value)}
                placeholder="e.g. flex items-center"
                fullWidth
              />
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}
    </Stack>
  );
}
