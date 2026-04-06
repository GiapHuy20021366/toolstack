/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGraphicStateValue } from "@hooks/editor";
import { INativeStateProps } from "@contexts/editor";
import { Stack } from "@mui/material";
import { CSSProperties, useMemo, useState } from "react";
import { STYLE_PROPERTY_DEFS, STYLE_PROPERTY_MAP } from "./TsStyleEditor.data";

export interface ITsStyleEditorProps extends INativeStateProps<{
    includes?: (keyof CSSProperties)[];
    excludes?: (keyof CSSProperties)[];
}> { }

export default function TsStyleEditor({
    cid,
    state,
    options
}: ITsStyleEditorProps) {
    const [styleValue, setStyleValue] = useGraphicStateValue<[keyof CSSProperties, any][]>(cid, state.name, [["" as any, ""]]);
    const value = useMemo((): [keyof CSSProperties, any][] => {
        if (!Array.isArray(styleValue) || styleValue.length === 0) {
            return [["" as any, ""]];
        }
        return styleValue;
    }, [styleValue]);
    const stylePropertyDefs = useMemo(() => {
        const includes = options?.includes;
        const excludes = options?.excludes;
        if (includes == null && excludes == null) {
            return STYLE_PROPERTY_DEFS;
        }
        return STYLE_PROPERTY_DEFS.filter((def) => {
            return (includes == null || includes.includes(def.key)) && (excludes == null || !excludes.includes(def.key))
        });
    }, [options?.includes, options?.excludes]);

    const [updateCount, setUpdateCount] = useState<number>(0);
    const handleChangeProp = (idx: number, newProp: keyof CSSProperties) => {
        const def = STYLE_PROPERTY_MAP[newProp];
        if (def == null) {
            return;
        }
        if (newProp) {
            value[idx] = [newProp, def.defaultValue];
        } else {
            value.splice(idx, 1);
        }
        const lstProp = value[value.length - 1];
        if (lstProp == null || lstProp[0]) {
            value.push(["" as any, ""]);
        }
        setStyleValue([...value]);
        setUpdateCount(updateCount + 1);
    }

    const handleChangeValue = (idx: number, val: any) => {
        const propData = value[idx];
        if (value == null) return;
        const def = STYLE_PROPERTY_MAP[propData[0]];
        if (def == null) return;

        if (def.validator && def.validator(val) != null) {
            return;
        } else {
            value[idx] = [propData[0], def.converter(val)];
            setStyleValue([...value]);
        }
    }

    return (
        <Stack direction={"column"} gap={0.1}>
            {
                value.map(([prop, value], idx) => {
                    const def = STYLE_PROPERTY_MAP[prop];
                    if (def == null) {
                        return <></>
                    }
                    return (
                        <Stack key={`${prop}.${idx}.${updateCount}`} direction={"row"}>
                            <select defaultValue={prop} onChange={(e) => handleChangeProp(idx, e.target.value as keyof CSSProperties)}>
                                {
                                    stylePropertyDefs.map((def) => (<option key={def.key}>{def.key}</option>))
                                }
                            </select>
                            {
                                def.editorType === "input" && (
                                    <input defaultValue={value}
                                        onBlur={(e) => handleChangeValue(idx, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleChangeValue(idx, (e.target as HTMLInputElement).value)
                                            }
                                        }}
                                        placeholder={def.placeholder}
                                    />
                                )
                            }
                            {def.editorType === "checkbox" && (
                                <input
                                    type="checkbox"
                                    defaultChecked={value}
                                    onChange={(e) => handleChangeValue(idx, e.target.checked)}
                                />
                            )}
                            {def.editorType === "select" && (
                                <select defaultValue={value} onChange={(e) => handleChangeValue(idx, e.target.value)}>
                                    {
                                        (def.selectOptions ?? []).map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.text}</option>
                                        ))
                                    }
                                </select>
                            )}
                        </Stack>
                    )
                })
            }
        </Stack>
    );
}
