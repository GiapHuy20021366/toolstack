import { useGraphicStateValue } from "@hooks/editor";
import { INativeStateProps } from "@contexts/editor";


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
