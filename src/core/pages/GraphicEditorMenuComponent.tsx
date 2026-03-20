import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { CTsComponentManager } from "../manager/component-manager";
import { useEffect, useRef, useState } from "react";
import "../components/pieces";
import useGraphicEditorContext from "./useGraphicEditorContext";
import { getUID } from "../utils/uid-util";
import useGraphicComponents from "./useGraphicComponents";
import { cloneGraphicComponent } from "./data";
import useWorkspaceDragOverComponent from "../hooks/editor/workspace/useWorkspaceDragOverComponent";

export default function GraphicEditorMenuComponent() {
  const { addGraphic } = useGraphicEditorContext();
  const { nativeComponents, graphicComponents } = useGraphicComponents();
  const { dragoverCid, setDragoverCid } = useWorkspaceDragOverComponent();

  const [dragging, setDragging] = useState<string | null>(null);
  const dragStartOffsetRef = useRef({ x: 0, y: 0 });
  const dragFinalOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!dragging) {
      setDragoverCid("");
      return;
    }

    const handleMove = (e: DragEvent) => {
      e.preventDefault();

      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el) return;

      const container = el.closest("[container-cid]") as HTMLElement | null;

      if (container) {
        const containerBound = container.getBoundingClientRect();
        const isInside =
          e.clientX >= containerBound.left &&
          e.clientX <= containerBound.right &&
          e.clientY >= containerBound.top &&
          e.clientY <= containerBound.bottom;

        if (!isInside) {
          setDragoverCid("");
          return;
        }

        const cid = container.getAttribute("container-cid");
        setDragoverCid(cid ?? "");

        dragFinalOffsetRef.current = {
          x: Math.floor(
            e.clientX - containerBound.x - dragStartOffsetRef.current.x,
          ),
          y: Math.floor(
            e.clientY - containerBound.y - dragStartOffsetRef.current.y,
          ),
        };
      } else {
        setDragoverCid("");
      }
    };

    window.addEventListener("dragover", handleMove);

    return () => {
      window.removeEventListener("dragover", handleMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  const onDragEnd = () => {
    if (!dragging) {
      return;
    }

    const type = CTsComponentManager.instance.getComponentType(dragging);
    switch (type) {
      case "native": {
        const component =
          CTsComponentManager.instance.getNativeComponent(dragging)!;
        addGraphic(
          {
            children: [],
            cid: getUID(),
            description: "",
            layout: {
              ...component.layout,
              ...dragFinalOffsetRef.current,
            },
            name: component.name,
            nativeCid: component.cid,
            state: {},
            visible: true,
            classes: "",
          },
          dragoverCid,
        );
        break;
      }
      case "graphic": {
        const component =
          CTsComponentManager.instance.getGraphicComponent(dragging)!;
        const cloned = cloneGraphicComponent(component);
        cloned.data.layout = {
          ...cloned.data.layout,
          ...dragFinalOffsetRef.current,
        };
        addGraphic(cloned.data, dragoverCid);
        break;
      }
      case "other": {
        break;
      }
    }

    setDragging(null);
  };

  return (
    <Box
      sx={{
        width: 400,
      }}
    >
      {/* Native */}
      {
        <Accordion defaultExpanded={true}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Native Component</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="row" flexWrap="wrap" gap={2}>
              {nativeComponents.map((component) => {
                const isDragging = dragging === component.cid;

                return (
                  <Box
                    key={component.cid}
                    title={component.description}
                    sx={{
                      maxWidth: 120,
                      p: 1,
                      borderRadius: 2,
                      border: "1px solid transparent",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      transition: "all 0.2s ease",
                      userSelect: "none",

                      "&:hover": {
                        borderColor: "primary.main",
                        boxShadow: 3,
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    {/* DRAGGABLE IMAGE */}
                    <Box
                      component="img"
                      src={component.image}
                      alt={component.name}
                      draggable
                      onDragStart={(e) => {
                        setDragging(component.cid);

                        const img = e.currentTarget as HTMLElement;
                        const rect = img.getBoundingClientRect();

                        dragStartOffsetRef.current = {
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                        };

                        // Data passing
                        e.dataTransfer.setData("componentName", component.cid);
                      }}
                      onDragEnd={onDragEnd}
                      sx={{
                        width: "100%",
                        maxWidth: component.layout.width,
                        height: "auto",
                        objectFit: "contain",
                        cursor: "grab",
                        transition: "all 0.2s ease",

                        ...(isDragging && {
                          opacity: 0.5,
                          transform: "scale(0.95)",
                          cursor: "grabbing",
                        }),
                      }}
                    />

                    {/* TEXT */}
                    <Box
                      sx={{
                        mt: 1,
                        textAlign: "center",
                        fontSize: 13,
                        width: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {component.name}
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </AccordionDetails>
        </Accordion>
      }
      {/* Graphic piece */}
      {
        <Accordion defaultExpanded={true}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Graphic Component</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="row" flexWrap="wrap" gap={2}>
              {graphicComponents.map((component) => {
                const isDragging = dragging === component.cid;

                return (
                  <Box
                    key={component.cid}
                    title={component.description}
                    sx={{
                      maxWidth: 120,
                      p: 1,
                      borderRadius: 2,
                      border: "1px solid transparent",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      transition: "all 0.2s ease",
                      userSelect: "none",

                      "&:hover": {
                        borderColor: "primary.main",
                        boxShadow: 3,
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    {/* DRAGGABLE IMAGE */}
                    <Box
                      component="img"
                      src={component.image}
                      alt={component.name}
                      draggable
                      onDragStart={(e) => {
                        setDragging(component.cid);

                        const img = e.currentTarget as HTMLElement;
                        const rect = img.getBoundingClientRect();

                        dragStartOffsetRef.current = {
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                        };

                        // Data passing
                        e.dataTransfer.setData("componentName", component.name);
                      }}
                      onDragEnd={onDragEnd}
                      sx={{
                        width: "100%",
                        height: "auto",
                        objectFit: "contain",
                        cursor: "grab",
                        transition: "all 0.2s ease",

                        ...(isDragging && {
                          opacity: 0.5,
                          transform: "scale(0.95)",
                          cursor: "grabbing",
                        }),
                      }}
                    />

                    {/* TEXT */}
                    <Box
                      sx={{
                        mt: 1,
                        textAlign: "center",
                        fontSize: 13,
                        width: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {component.name}
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </AccordionDetails>
        </Accordion>
      }
    </Box>
  );
}
