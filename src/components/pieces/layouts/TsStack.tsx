import React from "react";
import {
    useGraphicDataClasses,
    useGraphicStateStyle,
    useGraphicStateValue,
} from "@hooks/editor";
import type { Property } from "csstype";

interface IProps {
    cid: string;
    children?: React.ReactNode;
}

export default function TsStack({ cid, children }: IProps) {
    const { classes } = useGraphicDataClasses(cid);
    const { style } = useGraphicStateStyle(cid, false);

    const [flexDirection] = useGraphicStateValue<Property.FlexDirection>(cid, "direction", "row");
    const [gap] = useGraphicStateValue<Property.Gap>(cid, "gap", 0);
    const [justifyContent] = useGraphicStateValue<Property.JustifyContent>(cid, "justifyContent", "flex-start");
    const [alignItems] = useGraphicStateValue<Property.AlignItems>(cid, "alignItems", "stretch");
    const [flexWrap] = useGraphicStateValue<Property.FlexWrap>(cid, "wrap", "nowrap");

    return (
        <div
            className={classes}
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: flexDirection,
                gap: `${gap}px`,
                justifyContent,
                alignItems,
                flexWrap,
                ...style
            }}
        >
            {children}
        </div>
    );
}