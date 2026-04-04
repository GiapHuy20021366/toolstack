import "@styles/App.css";
import GraphicEditorScreen from "@pages/editor/GraphicEditorScreen";
import ApplicationContextProvider from "./contexts/common/ApplicationContextProvider";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "@pages/layouts/MainLayout";

function App() {
  return (
    <ApplicationContextProvider>
      <HashRouter>
        <Routes>
          {/* Layout wrapper */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/editor/new" element={<GraphicEditorScreen />} />
            <Route path="/editor/:cid" element={<GraphicEditorScreen />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </HashRouter>
    </ApplicationContextProvider>
  );
}
export default App;
