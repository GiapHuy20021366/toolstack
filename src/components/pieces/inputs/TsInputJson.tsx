import { useRef, useEffect } from "react";
import {
  useGraphicDataClasses,
  useGraphicDataStyle,
  useGraphicStateValue
} from "@hooks/editor";
import { EJsonInputType, isValidInputValue, JSON_TYPE_OPTIONS } from "./TsInputJson.config";

interface IProps {
    cid: string;
}

export default function TsInputJson({ cid }: IProps) {
    const [value, setValue] = useGraphicStateValue(cid, "value", "");
    const [type, setType] = useGraphicStateValue(cid, "type", EJsonInputType.ANY);
    const { classes } = useGraphicDataClasses(cid);
    const { style } = useGraphicDataStyle(cid);

    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.value = JSON.stringify(value, null, 2);
        }
    }, [value]);

    return (
        <div style={{
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            position: "relative",
            ...style
        }}>
            <select value={type} onChange={(e) => setType(e.target.value as EJsonInputType)} style={{
                width: "75px",
                position: "absolute",
                top: 0,
                right: 0
            }}>
                {
                    JSON_TYPE_OPTIONS.map((option) => (
                        <option value={option.value} key={option.value}>{option.text}</option>
                    ))
                }
            </select>
            <textarea
                ref={inputRef}
                style={{
                    width: "100%",
                    height: "100%",
                    boxSizing: "border-box",
                }}
                defaultValue={JSON.stringify(value, null, 2)}
                onBlur={(e) => {
                    const inputValue = e.target.value;
                    if (isValidInputValue(inputValue, type)) {
                        setValue(JSON.parse(inputValue));
                    }
                }}
                className={classes}
            />
        </div>
    );
}
