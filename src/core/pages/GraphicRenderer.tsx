import { Rnd } from "react-rnd";
import { Stack } from "@mui/material";
import {
  DeleteOutlined,
  ExitToApp,
  OpenWithOutlined,
  SettingsSuggestOutlined,
} from "@mui/icons-material";
import useGraphicEditorContext from "./useGraphicEditorContext";
import React, { useMemo } from "react";
import { CTsComponentManager } from "../manager/component-manager";
import useGraphicDataLayout from "../hooks/editor/component/useGraphicDataLayout";
import useGraphicDataChildren from "../hooks/editor/component/useGraphicDataChildren";
import useGraphicDataNativeCid from "../hooks/editor/component/useGraphicDataNativeCid";
import useWorkspaceSelectedComponent from "../hooks/editor/workspace/useWorkspaceSelectedComponent";
import useWorkspaceDragOverComponent from "../hooks/editor/workspace/useWorkspaceDragOverComponent";
import useGraphicDataVisible from "../hooks/editor/component/useGraphicDataVisible";

interface IProps {
  cid: string;
}

export default function GraphicRenderer({ cid }: IProps) {
  const { layout, setLayout } = useGraphicDataLayout(cid);
  const { children } = useGraphicDataChildren(cid);
  const { nativeCid } = useGraphicDataNativeCid(cid);
  const { selectedCid, setSelectedCid } = useWorkspaceSelectedComponent();
  const { dragoverCid } = useWorkspaceDragOverComponent();
  const { deleteGraphic, exportGraphicPiece } = useGraphicEditorContext();
  const { visible } = useGraphicDataVisible(cid);

  const isSelected = cid === selectedCid;
  const isDragOver = dragoverCid === cid;

  const nativeComponent = useMemo(() => {
    if (!nativeCid) {
      return null;
    }
    const component =
      CTsComponentManager.instance.getNativeComponent(nativeCid);
    if (!component) {
      return null;
    }
    return component;
  }, [nativeCid]);

  const isContainer = !!nativeComponent?.isContainer;

  return (
    <>
      {layout != null && visible && (
        <Rnd
          component-cid={cid}
          container-cid={isContainer ? cid : undefined}
          data-layout-x={layout.x}
          data-layout-y={layout.y}
          position={{
            x: layout.x,
            y: layout.y,
          }}
          size={{
            width: layout.width,
            height: layout.height,
          }}
          minWidth={layout.minWidth}
          minHeight={layout.minHeight}
          maxWidth={layout.maxWidth}
          maxHeight={layout.maxHeight}
          onDragStart={() => {
            setSelectedCid(cid);
          }}
          onResizeStart={() => {
            setSelectedCid(cid);
          }}
          onDragStop={(_e, d) => {
            setLayout({ ...layout, x: Math.floor(d.x), y: Math.floor(d.y) });
          }}
          onResizeStop={(_e, _dir, ref, _delta, position) => {
            setLayout({
              ...layout,
              x: Math.floor(position.x),
              y: Math.floor(position.y),
              width: parseInt(ref.style.width),
              height: parseInt(ref.style.height),
            });
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            setSelectedCid(cid);
          }}
          bounds="parent"
          className={`inner-rnd graphic-component ${isSelected ? "selected" : ""} ${isDragOver ? "drag-over" : ""} ${isContainer ? "container" : ""}`}
          id={cid}
          dragHandleClassName="nested-header"
          cancel=".inner-element"
        >
          {/* Utils */}
          <Stack
            direction={"row"}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              transform: "translateY(calc(-100% - 4px))",
              border: "1px solid black",
              boxSizing: "border-box",
              display: isSelected ? "block" : "none",
              px: 1,
              minWidth: 115,
            }}
            gap={1}
          >
            <DeleteOutlined color="error" onClick={() => deleteGraphic(cid)} />
            <ExitToApp
              titleAccess="Export to a graphic piece"
              onClick={() => exportGraphicPiece(cid)}
            />
            <SettingsSuggestOutlined />
            <OpenWithOutlined
              className="nested-header"
              sx={{
                cursor: "all-scroll",
              }}
            />
          </Stack>

          {/* Location info */}
          {
            <Stack
              direction={"row"}
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                transform: "translateY(calc(100% + 4px))",
                border: "1px solid black",
                boxSizing: "border-box",
                display: isSelected ? "block" : "none",
                px: 1,
                minWidth: 90,
              }}
              gap={1}
            >
              [{layout.x},{layout.y},{layout.width},{layout.height}]
            </Stack>
          }

          {/* Element */}
          {nativeComponent != null &&
            React.createElement(nativeComponent?.element, {
              cid,
              children: (children ?? []).map((cid) => (
                <GraphicRenderer key={cid} cid={cid} />
              )),
            })}
        </Rnd>
      )}
    </>
  );
}
