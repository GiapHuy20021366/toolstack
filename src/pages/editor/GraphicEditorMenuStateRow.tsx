/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Stack } from "@mui/material";
import {
  INativeComponentState,
  INativeStateProps,
} from "@contexts/editor";
import React, { useEffect, useRef } from "react";
import {
  useGraphicStateValueIn,
  useGraphicStateValueOut
} from "@hooks/editor";

interface IProps {
  cid: string;
  state: INativeComponentState<any, INativeStateProps<any>>;
}
export default function GraphicEditorMenuStateRow({ cid, state }: IProps) {
  const [stateIn, setStateIn] = useGraphicStateValueIn(cid, state.name, "");
  const [stateOut, setStateOut] = useGraphicStateValueOut(cid, state.name, "");

  const refStateIn = useRef<HTMLInputElement>(null);
  const refStateOut = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const element = refStateIn.current;
    if (element != null) {
      element.value = stateIn;
    }
  }, [stateIn]);

  useEffect(() => {
    const element = refStateOut.current;
    if (element != null) {
      element.value = stateOut;
    }
  }, [stateOut]);

  return (
    <Stack direction={"column"} gap={0.1}>
      <Stack direction={"row"} gap={0.5}>
        <Box sx={{ width: 80, minWidth: 80 }}>{state.name}</Box>
        <Box sx={{ flex: 1 }}>
          {state.editor
            ? React.createElement(state.editor.element, {
              cid: cid,
              state: state,
              options: state.editor.options,
              key: cid + "." + state.name
            })
            : ""}
        </Box>
      </Stack>

      {state.isStateIn !== false && (
        <Stack direction={"row"} gap={1}>
          <Box sx={{ width: 80 }}></Box>
          <Box sx={{ width: 20 }}>in:</Box>
          <Box sx={{ flex: 1 }}>
            <input
              ref={refStateIn}
              defaultValue={stateIn}
              onBlur={(e) => {
                setStateIn(e.target.value)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && refStateIn.current) {
                  setStateIn(refStateIn.current.value)
                }
              }}
            />
          </Box>
        </Stack>
      )}

      {state.isStateOut !== false && (
        <Stack direction={"row"} gap={1}>
          <Box sx={{ width: 80 }}></Box>
          <Box sx={{ width: 20 }}>out:</Box>
          <Box sx={{ flex: 1 }}>
            <input
              ref={refStateOut}
              defaultValue={stateOut}
              onBlur={(e) => {
                setStateOut(e.target.value)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && refStateOut.current) {
                  setStateOut(refStateOut.current.value)
                }
              }}
            />
          </Box>
        </Stack>
      )}
    </Stack>
  );
}
