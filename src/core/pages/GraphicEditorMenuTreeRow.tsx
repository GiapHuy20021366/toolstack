import { useMemo, useState } from "react";
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";

import { CTsComponentManager } from "../manager/component-manager";
import useGraphicDataChildren from "../hooks/editor/component/useGraphicDataChildren";
import useGraphicDataNativeCid from "../hooks/editor/component/useGraphicDataNativeCid";
import useWorkspaceSelectedComponent from "../hooks/editor/workspace/useWorkspaceSelectedComponent";
import useGraphicDataVisible from "../hooks/editor/component/useGraphicDataVisible";
import useGraphicDataName from "../hooks/editor/component/useGraphicDataName";

interface IProps {
  cid: string;
  depth?: number;
  parentVisible?: boolean;
}

export default function GraphicEditorMenuTreeRow({
  cid,
  depth = 0,
  parentVisible = true,
}: IProps) {
  const [open, setOpen] = useState(true);

  const { selectedCid, setSelectedCid } = useWorkspaceSelectedComponent();

  const { children } = useGraphicDataChildren(cid);
  const { name } = useGraphicDataName(cid);
  const { nativeCid } = useGraphicDataNativeCid(cid);
  const { visible, setVisible } = useGraphicDataVisible(cid);

  const nativeComponent = useMemo(() => {
    if (!nativeCid) return null;
    return CTsComponentManager.instance.getNativeComponent(nativeCid);
  }, [nativeCid]);

  if (!nativeComponent) return null;

  const isSelected = cid === selectedCid;
  const hasChildren = children && children.length > 0;

  // 🔥 KEY: visibility cascade
  const effectiveVisible = parentVisible && visible;

  const handleClick = () => {
    setSelectedCid(isSelected ? "" : cid);
  };

  return (
    <Box>
      <ListItemButton
        dense
        selected={isSelected}
        onClick={handleClick}
        sx={{
          pl: 2 + depth * 2,
          borderRadius: 1,

          "&:hover": {
            bgcolor: "action.hover",
          },
          "&.Mui-selected": {
            bgcolor: "action.selected",
          },
        }}
      >
        {/* TEXT */}
        <ListItemText
          primary={name || nativeComponent.name}
          primaryTypographyProps={{
            fontSize: 13,
            noWrap: true,
            sx: {
              opacity: effectiveVisible ? 1 : 0.5,
              textDecoration: effectiveVisible ? "none" : "line-through",
            },
          }}
        />

        {/* ACTIONS */}
        <Box display="flex" alignItems="center" gap={0.5}>
          {/* Expand */}
          {hasChildren && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
            >
              {open ? (
                <ExpandLess fontSize="small" />
              ) : (
                <ExpandMore fontSize="small" />
              )}
            </IconButton>
          )}

          {/* Visibility */}
          <Tooltip
            title={
              !parentVisible ? "Hidden by parent" : visible ? "Hide" : "Show"
            }
          >
            <span>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setVisible(!visible);
                }}
              >
                {effectiveVisible ? (
                  <VisibilityOutlined fontSize="small" />
                ) : (
                  <VisibilityOffOutlined fontSize="small" />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </ListItemButton>

      {/* CHILDREN */}
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding>
            {children.map((child) => (
              <GraphicEditorMenuTreeRow
                key={child}
                cid={child}
                depth={depth + 1}
                parentVisible={effectiveVisible}
              />
            ))}
          </List>
        </Collapse>
      )}
    </Box>
  );
}
