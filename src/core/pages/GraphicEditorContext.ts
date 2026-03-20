import { createContext } from "react";
import { getUID } from "../utils/uid-util";
import { IGraphicComponentData } from "../manager/component-manager";

export interface IGraphicEditorContext {
  cid: string;
  isNew: boolean;
  save: () => void;
  load: (storageKey: string) => void;
  addGraphic: (data: IGraphicComponentData, parentCid?: string | null) => void;
  deleteGraphic: (cid: string) => void;
  exportGraphicPiece: (cid: string) => void;
}

export const GraphicEditorContext = createContext<IGraphicEditorContext>({
  cid: getUID(),
  isNew: true,
  load: (_storageKey: string) => {},
  save: () => {},
  addGraphic: (_data: IGraphicComponentData, _parentCid?: string | null) => {},
  deleteGraphic: (_cid: string) => {},
  exportGraphicPiece: (_cid: string) => {},
});
