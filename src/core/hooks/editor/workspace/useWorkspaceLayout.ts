import { SCREEN_RESOLUTIONS } from "../../../pages/data";
import useWorkspaceState from "../state/useWorkspaceState";

export default function useWorkspaceLayout() {
  const [scale, setScale] = useWorkspaceState("layout.scale", 100);
  const [width, setWidth] = useWorkspaceState(
    "layout.width",
    SCREEN_RESOLUTIONS[0].width,
  );
  const [height, setHeight] = useWorkspaceState(
    "layout.height",
    SCREEN_RESOLUTIONS[0].height,
  );
  const [resolution, setResolution] = useWorkspaceState(
    "layout.resolution",
    SCREEN_RESOLUTIONS[0].id,
  );
  return {
    scale: scale,
    setScale: setScale,
    width: width,
    setWidth: setWidth,
    height: height,
    setHeight: setHeight,
    resolution: resolution,
    setResolution: setResolution,
  };
}
