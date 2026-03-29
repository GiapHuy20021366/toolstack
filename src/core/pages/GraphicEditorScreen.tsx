import { useParams } from "react-router-dom";
import TsContextProvider from "../context/TsContextProvider";
import GraphicEditorContextProvider from "./GraphicEditorContextProvider";
import GraphicEditorMain from "./GraphicEditorMain";
import "./GraphicEditor.scss";
import "../components/classes"

export default function GraphicEditorScreen() {
  const { cid } = useParams();
  return (
    <TsContextProvider>
      <GraphicEditorContextProvider cid={cid}>
        <GraphicEditorMain />
      </GraphicEditorContextProvider>
    </TsContextProvider>
  );
}
