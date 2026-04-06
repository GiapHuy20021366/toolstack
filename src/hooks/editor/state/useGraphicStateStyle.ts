/* eslint-disable @typescript-eslint/no-explicit-any */
import { CSSProperties, useMemo } from "react";
import useGraphicStateValue from "./useGraphicStateValue";
import { CONTROLLED_STYLES } from "@data/editor";

/**
 * Get the style state
 * @param cid 
 * @param forRenderer For wrapper component
 * @returns 
 */
export default function useGraphicStateStyle(cid: string, forRenderer: boolean) {
    const [styleValue, _setStyleValue] = useGraphicStateValue<[keyof CSSProperties, any][]>(cid, "style", []);

    const style = useMemo((): CSSProperties => {
        if (!Array.isArray(styleValue)) return {};
        const rs: CSSProperties = {};
        for (const val of styleValue) {
            // Check skip condition
            let skip = false;
            if (forRenderer != null) {
                if (forRenderer) {
                    skip = !CONTROLLED_STYLES.includes(val[0]);
                } else {
                    skip = CONTROLLED_STYLES.includes(val[0]);
                }
            }

            if (!skip) {
                try {
                    if (val[0] && val[1] != null)
                        rs[val[0]] = val[1];
                } catch (error) {
                    // Do nothing
                }
            }
        }
        return rs;
    }, [styleValue, forRenderer]);

    return {
        style: style
    }
}