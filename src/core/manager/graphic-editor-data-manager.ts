import { GraphicEditorStateHandler } from "./graphic-editor-state-handler";
import { CTsVariableManager } from "./variable-manager";

export class GraphicEditorDataManager extends CTsVariableManager {
  protected _stateHandler: GraphicEditorStateHandler;

  constructor() {
    super();
    this._stateHandler = new GraphicEditorStateHandler(this);
  }

  get stateHandler() {
    return this._stateHandler;
  }
}
