import {
    useGraphicDataClasses,
    useGraphicDataStyle,
    useGraphicStateValue,
    useFuncExecutor
} from "@hooks/editor";
import { IFuncState } from "@contexts/editor";
import { getDefaultFuncStateValue } from "@contexts/editor";

interface IProps {
    cid: string;
}
export default function TsButton({ cid }: IProps) {
    const [value, _setValue] = useGraphicStateValue(cid, "value", "");
    const [text, _setText] = useGraphicStateValue(cid, "text", "");
    const { classes } = useGraphicDataClasses(cid);
    const { style } = useGraphicDataStyle(cid);
    const [onClickEvent] = useGraphicStateValue<IFuncState>(cid, "on-click", getDefaultFuncStateValue());

    const { execute } = useFuncExecutor();

    return (
        <button
            style={{
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...style
            }
            }
            value={value}
            onClick={(event) => {
                execute(onClickEvent, { $$event: event });
            }}
            className={classes}
        >
            {text || "Button"}
        </button>
    );
}
