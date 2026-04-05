import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { CTsComponentManager, INativeComponentState } from "@contexts/editor";
import GraphicEditorMenuStateRow from "./GraphicEditorMenuStateRow";
import {
  useEditorStateContext,
  useWorkspaceSelectedComponent,
} from "@hooks/editor";
import { ACCESSORS } from "@data/editor";
import { OTHER_GROUP } from "@components/pieces";
import { ExpandMore } from "@mui/icons-material";

export default function GraphicEditorMenuState() {
  const { selectedCid } = useWorkspaceSelectedComponent();
  const { stateManager } = useEditorStateContext();

  const component = useMemo(() => {
    const nativeCid = ACCESSORS(stateManager)
      .component(selectedCid)
      .data.nativeCid.get();
    if (nativeCid) {
      return CTsComponentManager.instance.getNativeComponent(nativeCid);
    }
    return null;
  }, [selectedCid, stateManager]);

  const groupStates = useMemo(() => {
    const rs: Record<string, INativeComponentState<unknown>[]> = {};
    if (!component) return rs;
    for (const state of component.states) {
      if (!rs[state.group]) {
        rs[state.group] = [];
      }
      rs[state.group].push(state);
    }
    return rs;
  }, [component]);

  return (
    <Box
      sx={{
        minWidth: 400,
        width: "fit-content",
      }}
    >
      <Stack direction={"column"} gap={1}>
        {Object.entries(groupStates).map(([groupId, states]) => {
          const group =
            component?.groups.find((g) => g.id === groupId) ?? OTHER_GROUP;
          return (
            <Accordion defaultExpanded disableGutters key={groupId}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle2">{group.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction={"column"} gap={1} sx={{ mb: 2 }}>
                  {states.map((state) => (
                    <GraphicEditorMenuStateRow
                      key={selectedCid + state.name}
                      cid={selectedCid}
                      state={state}
                    />
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>
    </Box>
  );
}
