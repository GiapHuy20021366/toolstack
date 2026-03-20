/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Stack } from "@mui/material";
import {
  INativeComponentState,
  INativeStateProps,
} from "../manager/component-manager";
import React from "react";
import useTsComponentStateIn from "../hooks/editor/state/useGraphicStateValueIn";
import useTsComponentStateOut from "../hooks/editor/state/useGraphicStateValueOut";

interface IProps {
  cid: string;
  state: INativeComponentState<any, INativeStateProps<any>>;
}
export default function GraphicEditorMenuStateRow({ cid, state }: IProps) {
  const [stateIn, setStateIn] = useTsComponentStateIn(cid, state.name, "");
  const [stateOut, setStateOut] = useTsComponentStateOut(cid, state.name, "");

  return (
    <Stack direction={"column"} gap={0.1}>
      <Stack direction={"row"} gap={1}>
        <Box sx={{ width: 60 }}>{state.name}</Box>
        <Box sx={{ flex: 1 }}>
          {state.editor
            ? React.createElement(state.editor.element, {
                cid: cid,
                state: state,
                options: state.editor.options,
              })
            : ""}
        </Box>
      </Stack>

      {state.isStateIn !== false && (
        <Stack direction={"row"} gap={1}>
          <Box sx={{ width: 60 }}></Box>
          <Box sx={{ flex: 1 }}>
            <input
              value={stateIn}
              onChange={(e) => setStateIn(e.target.value)}
            />
          </Box>
        </Stack>
      )}

      {state.isStateOut !== false && (
        <Stack direction={"row"} gap={1}>
          <Box sx={{ width: 60 }}></Box>
          <Box sx={{ flex: 1 }}>
            <input
              value={stateOut}
              onChange={(e) => setStateOut(e.target.value)}
            />
          </Box>
        </Stack>
      )}
    </Stack>
  );
}
