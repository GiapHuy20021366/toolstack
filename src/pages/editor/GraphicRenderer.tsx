/* eslint-disable @typescript-eslint/no-explicit-any */
import { Rnd } from "react-rnd";
import { Stack } from "@mui/material";
import {
  ArrowDownward,
  ArrowUpward,
  DeleteOutlined,
  OpenWithOutlined,
} from "@mui/icons-material";
import { useGraphicEditorContext, useGraphicStateStyle } from "@hooks/editor";
import React, { CSSProperties, useLayoutEffect, useMemo, useRef } from "react";
import { CTsComponentManager, ENativeComponentRole } from "@contexts/editor";
import {
  useGraphicDataLayout,
  useGraphicDataChildren,
  useGraphicDataNativeCid,
  useWorkspaceSelectedComponent,
  useWorkspaceDragOverComponent,
  useGraphicDataVisible,
  useSelectedLayer,
  useGraphicDataName,
} from "@hooks/editor";

interface IProps {
  cid: string;
  inLayer?: boolean;
  disableTransform?: boolean;
}

const toKebabCase = (str: string) =>
  str.replace(/[A-Z]/g, (match) => "-" + match.toLowerCase());

export default function GraphicRenderer({
  cid,
  inLayer,
  disableTransform,
}: IProps) {
  const { layout, setLayout } = useGraphicDataLayout(cid);
  const { children } = useGraphicDataChildren(cid);
  const { nativeCid } = useGraphicDataNativeCid(cid);
  const { selectedCid, setSelectedCid } = useWorkspaceSelectedComponent();
  const { dragoverCid } = useWorkspaceDragOverComponent();
  const { deleteGraphic, bringComponentToBack, bringComponentToFront } =
    useGraphicEditorContext();
  const { visible } = useGraphicDataVisible(cid);
  const { name } = useGraphicDataName(cid);
  const { isVisibleBySelectedLayer, selectedLayer } = useSelectedLayer();

  const { style } = useGraphicStateStyle(cid, true);


  const ref = useRef<any>();

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

  const isContainer =
    nativeComponent != null &&
    nativeComponent.role >= ENativeComponentRole.CONTAINER;
  const isLayer =
    nativeComponent != null &&
    nativeComponent.role >= ENativeComponentRole.LAYER;
  const isScreen =
    nativeComponent != null &&
    nativeComponent.role >= ENativeComponentRole.LAYER;

  inLayer ||= cid === selectedLayer;
  const className = [
    "inner-rnd",
    "graphic-component",
    isSelected && "selected",
    isDragOver && "drag-over",
    isContainer && "container",
    isLayer && "layer",
    isScreen && "screen",
    disableTransform && "disable-transform",
    !isVisibleBySelectedLayer(cid, inLayer, visible) && "hidden",
  ]
    .filter(Boolean)
    .join(" ");

  // Force override of state each time render
  useLayoutEffect(() => {
    try {
      const refCurrent = ref.current;
      const element = (refCurrent?.resizable?.resizable || refCurrent?.draggable?.draggable) as HTMLDivElement | undefined;
      if (element != null) {
        for (const prop in style) {
          const cssKey = toKebabCase(prop);
          element.style.setProperty(
            cssKey,
            style[prop as keyof CSSProperties] as any
          );
        }
      }
    } catch (error) {
      // 
    }
  });

  return (
    <>
      {layout != null && (
        <Rnd
          ref={ref}
          component-cid={cid}
          container-cid={isContainer ? cid : undefined}
          layer-cid={isLayer ? cid : undefined}
          screen-cid={isScreen ? cid : undefined}
          component-name={name}
          component-role={
            nativeComponent?.role != null
              ? String(nativeComponent.role)
              : undefined
          }
          position={{
            x: !disableTransform ? layout.x : 0,
            y: !disableTransform ? layout.y : 0,
          }}
          size={{
            width: layout.width,
            height: layout.height,
          }}
          enableResizing={{
            top: !disableTransform,
            right: true,
            bottom: true,
            left: !disableTransform,
            topRight: !disableTransform,
            bottomRight: true,
            bottomLeft: !disableTransform,
            topLeft: !disableTransform,
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
          className={className}
          id={cid}
          dragHandleClassName="nested-header"
          cancel=".inner-element"
          disableDragging={disableTransform}
          style={{
            position: disableTransform ? "relative" : "absolute",
            display: disableTransform ? "block" : "inline-flex",
            ...style
          }}
        >
          {/* Utils */}
          {
            <Stack
              direction={"row"}
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                transform: "translateY(calc(-100% - 4px))",
                border: "1px solid black",
                boxSizing: "border-box",
                px: 1,
                minWidth: "fit-content",
              }}
              gap={0}
              className="component-utils"
            >
              <ArrowUpward onClick={() => bringComponentToFront(cid)} />
              <ArrowDownward onClick={() => bringComponentToBack(cid)} />
              <DeleteOutlined
                color="error"
                onClick={() => deleteGraphic(cid)}
              />
              {!disableTransform && (
                <OpenWithOutlined
                  className="nested-header"
                  sx={{
                    cursor: "all-scroll",
                  }}
                />
              )}
            </Stack>
          }

          {/* Location info */}
          {
            <Stack
              direction={"row"}
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                transform: "translateY(calc(100% + 4px))",
                border: "1px solid black",
                boxSizing: "border-box",
                px: 1,
                minWidth: 90,
              }}
              gap={1}
              className="component-layout"
            >
              [{disableTransform ? "__" : layout.x},
              {disableTransform ? "__" : layout.y},{layout.width},
              {layout.height}]
            </Stack>
          }

          {/* Element */}
          {nativeComponent != null &&
            React.createElement(nativeComponent?.element, {
              cid,
              children: (children ?? []).map((cid) => (
                <GraphicRenderer
                  key={cid}
                  cid={cid}
                  inLayer={inLayer}
                  disableTransform={
                    nativeComponent.rndBehaviors?.disableTransform
                  }
                />
              )),
            })}
        </Rnd>
      )}
    </>
  );
}
