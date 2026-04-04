import { createContext } from "react";
import { getUID } from "@utils";
import { IGraphicComponentData } from "./component-manager";

export interface IGraphicEditorContext {
  cid: string;
  isNew: boolean;
  save: () => void;
  load: (storageKey: string) => void;
  addGraphic: (data: IGraphicComponentData, parentCid?: string | null) => void;
  deleteGraphic: (cid: string) => void;
  exportGraphicPiece: (cid: string) => void;
  bringComponentToFront: (cid: string) => void;
  bringComponentToBack: (cid: string) => void;
}

export const GraphicEditorContext = createContext<IGraphicEditorContext>({
  cid: getUID(),
  isNew: true,
  load: (_storageKey: string) => { },
  save: () => { },
  addGraphic: (_data: IGraphicComponentData, _parentCid?: string | null) => { },
  deleteGraphic: (_cid: string) => { },
  exportGraphicPiece: (_cid: string) => { },
  bringComponentToFront: (_cid: string) => { },
  bringComponentToBack: (_cid: string) => { },
});
