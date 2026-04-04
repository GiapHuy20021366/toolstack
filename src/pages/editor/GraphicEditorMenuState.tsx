import { Box, Stack } from "@mui/material";
import { useMemo } from "react";
import { CTsComponentManager } from "@contexts/editor";
import GraphicEditorMenuStateRow from "./GraphicEditorMenuStateRow";
import {
  useEditorStateContext,
  useWorkspaceSelectedComponent,
} from "@hooks/editor";
import { ACCESSORS } from "@data/editor";

export default function GraphicEditorMenuState() {
  const { selectedCid } = useWorkspaceSelectedComponent();
  const { stateManager } = useEditorStateContext();

  const states = useMemo(() => {
    const nativeCid = ACCESSORS(stateManager)
      .component(selectedCid)
      .data.nativeCid.get();
    if (nativeCid) {
      const rs = CTsComponentManager.instance.getNativeComponent(nativeCid);
      return rs?.states ?? [];
    }
    return [];
  }, [selectedCid, stateManager]);

  return (
    <Box
      sx={{
        minWidth: 400,
        width: "fit-content",
      }}
    >
      <Stack direction={"column"} gap={1}>
        {states.map((state) => (
          <GraphicEditorMenuStateRow
            key={selectedCid + state.name}
            cid={selectedCid}
            state={state}
          />
        ))}
      </Stack>
    </Box>
  );
}
