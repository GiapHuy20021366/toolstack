import useTsComponentState from "./core/hook/useTsComponentState";
import useTsComponentStateIn from "./core/hook/useTsComponentStateIn";
import useTsComponentStateOut from "./core/hook/useTsComponentStateOut";
import useTsGlobalState from "./core/hook/useTsGlobalState";

interface IProps {
  cid: string;
}
export default function TestTsComponent({ cid }: IProps) {
  const [globalValue, setGlobalValue] = useTsGlobalState("globalValue", "");
  const [componentValue, setComponentValue] = useTsComponentState(
    cid,
    "componentValue",
    "",
  );
  const [stateInValue, setStateInValue] = useTsComponentStateIn(
    cid,
    "componentValue",
    "",
  );
  const [stateOutValue, setStateOutValue] = useTsComponentStateOut(
    cid,
    "componentValue",
    "",
  );
  return (
    <div>
      <div>
        <label htmlFor="">Global Value</label>
        <input
          type="text"
          value={globalValue}
          onChange={(event) => setGlobalValue(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="">Component Value</label>
        <input
          type="text"
          value={componentValue}
          onChange={(event) => setComponentValue(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="">State in value</label>
        <input
          type="text"
          value={stateInValue}
          onChange={(event) => setStateInValue(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="">State out value</label>
        <input
          type="text"
          value={stateOutValue}
          onChange={(event) => setStateOutValue(event.target.value)}
        />
      </div>
    </div>
  );
}
