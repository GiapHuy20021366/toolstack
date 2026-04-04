import { useContext } from "react";
import { GraphicEditorStateContext } from "@/contexts/editor/GraphicEditorStateContext";

export default function useEditorStateContext() {
  const context = useContext(GraphicEditorStateContext);
  return context;
}
