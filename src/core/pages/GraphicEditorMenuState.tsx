import { Box, Stack } from "@mui/material";
import { useMemo } from "react";
import { CTsComponentManager } from "../manager/component-manager";
import GraphicEditorMenuStateRow from "./GraphicEditorMenuStateRow";
import useTsContext from "../hooks/useTsContext";
import { ACCESSORS } from "./getter";
import useWorkspaceSelectedComponent from "../hooks/editor/workspace/useWorkspaceSelectedComponent";

export default function GraphicEditorMenuState() {
  const { selectedCid } = useWorkspaceSelectedComponent();
  const { stateManager } = useTsContext();

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
        width: 400,
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
