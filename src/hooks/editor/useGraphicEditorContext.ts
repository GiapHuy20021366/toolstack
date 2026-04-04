import { useContext } from "react";
import { GraphicEditorContext } from "@/contexts/editor/GraphicEditorContext";

export default function useGraphicEditorContext() {
  const context = useContext(GraphicEditorContext);
  return context;
}
