import useGraphicStateValue from "../../hooks/editor/state/useGraphicStateValue";
import { INativeStateProps } from "../../manager/component-manager";


export interface ITsInputNumberEditorProps extends INativeStateProps<{
    props?: React.InputHTMLAttributes<HTMLInputElement>,
    defaultValue?: number;
}> { }

export default function TsInputNumberEditor({
    cid,
    state,
    options
}: ITsInputNumberEditorProps) {
    const [value, setValue] = useGraphicStateValue<number | undefined>(
        cid,
        state.name,
        options?.defaultValue,
    );

    return (
        <input
            {...options?.props}
            type="number"
            value={value}
            onChange={(event) => setValue(+event.target.value)}
        />
    );
}
