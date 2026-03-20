import { useContext } from "react";
import { GraphicEditorContext } from "./GraphicEditorContext";

export default function useGraphicEditorContext() {
  const context = useContext(GraphicEditorContext);
  return context;
}
