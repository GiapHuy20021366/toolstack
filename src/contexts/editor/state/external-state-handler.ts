import { EditorStateHandler } from "./editor-state-handler";
import { EEditorStateManagerTag } from "./editor-state-manager";
import {
  stateManagerEvent,
  ISetValueEventData,
} from "../../common/state-manager";

export class ExternalStateHandler extends EditorStateHandler {
  public reset() {
    // Do nothing
  }

  public load() {
    // Do nothing
  }

  protected init() {
    this.handleStateChange();
  }

  private handleStateChange() {
    const parent = this.parent;
    parent.addListener(
      stateManagerEvent.INNER_SET_VALUE_ANY,
      (data: ISetValueEventData) => {
        const { key, newValue } = data as ISetValueEventData<string>;
        const [tag] = key.split(".");

        if (tag === EEditorStateManagerTag.EXTERNAL) {
          const externalKey = key.replace(
            `${EEditorStateManagerTag.EXTERNAL}.`,
            "",
          );
          parent.parent?.setValue(externalKey, newValue);
        }
      },
    );
  }
}
