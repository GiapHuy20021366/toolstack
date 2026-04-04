import { useParams } from "react-router-dom";
import GraphicEditorContextProvider from "@contexts/editor/GraphicEditorContextProvider";
import GraphicEditorStateContextProvider from "@contexts/editor/GraphicEditorStateContextProvider";
import GraphicEditorMain from "./GraphicEditorMain";

import "@components/pieces";
import "@styles/editor";
import "@functions";

export default function GraphicEditorScreen() {
  const { cid } = useParams();
  return (
    <GraphicEditorStateContextProvider>
      <GraphicEditorContextProvider cid={cid}>
        <GraphicEditorMain />
      </GraphicEditorContextProvider>
    </GraphicEditorStateContextProvider>
  );
}
