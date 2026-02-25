import useTsComponentState from "../../hook/useTsComponentState";

interface IProps {
  cid: string;
}
export default function TsInput({ cid }: IProps) {
  const [type, _setType] = useTsComponentState(cid, "type", "text");
  const [value, setValue] = useTsComponentState(cid, "value", "");

  return (
    <input
      type={type}
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}
