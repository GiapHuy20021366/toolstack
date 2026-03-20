import React, { useState } from "react";
import { Box, Button, TextField, Typography, IconButton } from "@mui/material";
import { GraphicSelectDialog } from "./GraphicSelectDialog";
import useGraphicEditorContext from "./useGraphicEditorContext";
import {
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
} from "@mui/icons-material";
import useWorkspaceName from "../hooks/editor/workspace/useWorkspaceName";
import useWorkspaceLeftBar from "../hooks/editor/workspace/useWorkspaceLeftBar";
import useWorkspaceRightBar from "../hooks/editor/workspace/useWorkspaceRightBar";

export default function GraphicEditorMainTopBar() {
  const { workspaceName, setWorkspaceName } = useWorkspaceName();
  const { open: rightBarOpen, setOpen: setRightBarOpen } =
    useWorkspaceRightBar();
  const { open: leftBarOpen, setOpen: setLeftBarOpen } = useWorkspaceLeftBar();
  const { save, load } = useGraphicEditorContext();

  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSaveName = () => {
    if (!workspaceName.trim()) {
      setWorkspaceName("No title");
    }
    setEditing(false);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        height: 40,
        borderBottom: "1px solid #e0e0e0",
        backgroundColor: "#fff",
      }}
    >
      {/* LEFT */}
      <Box sx={{ justifySelf: "start", display: "flex", gap: 1 }}>
        <IconButton size="small" onClick={() => setLeftBarOpen(!leftBarOpen)}>
          {leftBarOpen ? (
            <KeyboardDoubleArrowLeft />
          ) : (
            <KeyboardDoubleArrowRight />
          )}
        </IconButton>

        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setOpen(true);
          }}
        >
          Open
        </Button>
        <Button variant="contained" size="small" onClick={save}>
          Save
        </Button>
      </Box>

      {/* CENTER */}
      <Box
        sx={{
          justifySelf: "center",
          position: "relative",
          minWidth: 240,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {editing ? (
          <TextField
            inputRef={inputRef}
            size="small"
            variant="outlined"
            value={workspaceName}
            autoFocus
            onChange={(e) => setWorkspaceName(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveName();
              if (e.key === "Escape") setEditing(false);
            }}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                height: 36,
                fontSize: "1.25rem",
                fontWeight: 500,
              },
              "& input": {
                textAlign: "center",
                padding: "6px 8px",
              },
            }}
          />
        ) : (
          <Typography
            variant="h6"
            sx={{
              cursor: "pointer",
              userSelect: "none",
              textAlign: "center",
              width: "100%",
              lineHeight: "36px",
            }}
            onClick={() => setEditing(true)}
          >
            {workspaceName}
          </Typography>
        )}
      </Box>

      {/* RIGHT */}
      <Box sx={{ justifySelf: "end" }}>
        <IconButton size="small" onClick={() => setRightBarOpen(!rightBarOpen)}>
          {rightBarOpen ? (
            <KeyboardDoubleArrowRight />
          ) : (
            <KeyboardDoubleArrowLeft />
          )}
        </IconButton>
      </Box>

      {/* Dialogs */}
      <GraphicSelectDialog
        open={open}
        load={load}
        onClose={() => setOpen(false)}
      />
    </Box>
  );
}
