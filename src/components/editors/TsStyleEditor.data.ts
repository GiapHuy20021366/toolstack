import { CSSProperties } from "react";

export interface IStylePropertySelectOption {
    text: string;
    value: string;
}

export interface IStylePropertyDef<Value = string> {
    key: keyof CSSProperties;
    description: string;
    editorType: "input" | "select" | "checkbox";
    selectOptions?: IStylePropertySelectOption[];
    defaultValue?: Value;
    converter: (inputValue: string) => Value | undefined;
    validator?: (inputValue: string) => string[] | null;
    placeholder?: string;
}

const getCommonInputStyle = (key: keyof CSSProperties, description = ""): IStylePropertyDef => {
    return {
        description: description,
        key: key,
        editorType: "input",
        converter: defaultStringConverter
    } as const;
}

const defaultStringConverter = (inputValue: string) => {
    if (inputValue.trim() === "") return undefined;
    return inputValue;
}

export const NONE_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "" as any,
    editorType: "input",
    converter: defaultStringConverter
} as const;

// Layout
export const DISPLAY_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "display",
    editorType: "select",
    selectOptions: [
        { text: "", value: "" },
        { text: "block", value: "block" },
        { text: "inline", value: "inline" },
        { text: "inline-block", value: "inline-block" },
        { text: "none", value: "none" },
        { text: "flex", value: "flex" },
        { text: "inline-flex", value: "inline-flex" },
        { text: "grid", value: "grid" },
        { text: "inline-grid", value: "inline-grid" },
        { text: "flow-root", value: "flow-root" },
        { text: "contents", value: "contents" }
    ],
    converter: defaultStringConverter
} as const;

export const POSITION_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "position",
    editorType: "select",
    selectOptions: [
        { text: "", value: "" },
        { text: "static", value: "static" },
        { text: "relative", value: "relative" },
        { text: "absolute", value: "absolute" },
        { text: "fixed", value: "fixed" },
        { text: "sticky", value: "sticky" }
    ],
    converter: defaultStringConverter
} as const;

export const TOP_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "top",
    editorType: "input",
    converter: defaultStringConverter
} as const;
export const RIGHT_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "right",
    editorType: "input",
    converter: defaultStringConverter
} as const;
export const BOTTOM_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "bottom",
    editorType: "input",
    converter: defaultStringConverter
} as const;
export const LEFT_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "left",
    editorType: "input",
    converter: defaultStringConverter
} as const;

export const Z_INDEX_PROPERTY: IStylePropertyDef<number> = {
    description: "",
    key: "zIndex",
    editorType: "input",
    converter(inputValue) {
        if (inputValue.trim() === "") return undefined;
        const numVal = +inputValue;
        if (isNaN(numVal)) return undefined;
        return Math.floor(numVal);
    },
} as const;

export const OVERFLOW_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "overflow",
    editorType: "select",
    selectOptions: [
        { text: "", value: "" },
        { text: "visible", value: "visible" },
        { text: "hidden", value: "hidden" },
        { text: "scroll", value: "scroll" },
        { text: "auto", value: "auto" },
        { text: "clip", value: "clip" }
    ],
    converter: defaultStringConverter
} as const;

// Box model
export const WIDTH_PROPERTY = getCommonInputStyle("width");
export const HEIGHT_PROPERTY = getCommonInputStyle("height");
export const MARGIN_PROPERTY = getCommonInputStyle("margin");
export const MIN_WIDTH_PROPERTY = getCommonInputStyle("minWidth");
export const MAX_WIDTH_PROPERTY = getCommonInputStyle("maxWidth");
export const MIN_HEIGHT_PROPERTY = getCommonInputStyle("minHeight");
export const MAX_HEIGHT_PROPERTY = getCommonInputStyle("maxHeight");
export const PADDING_PROPERTY = getCommonInputStyle("padding");
export const BORDER_PROPERTY = getCommonInputStyle("border");
export const BOX_SIZING_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "boxSizing",
    editorType: "select",
    selectOptions: [
        { text: "", value: "" },
        { text: "content-box", value: "content-box" },
        { text: "border-box", value: "border-box" }
    ],
    converter: defaultStringConverter
} as const;

// Background + color
export const BACKGROUND_PROPERTY = getCommonInputStyle("background");
export const BACKGROUND_COLOR_PROPERTY = getCommonInputStyle("backgroundColor");
export const BACKGROUND_IMAGE_PROPERTY = getCommonInputStyle("backgroundImage");
export const BACKGROUND_POSITION_PROPERTY = getCommonInputStyle("backgroundPosition");
export const COLOR_PROPERTY = getCommonInputStyle("color");
export const OPACITY_PROPERTY: IStylePropertyDef<number> = {
    description: "",
    key: "opacity",
    editorType: "input",
    converter(inputValue) {
        if (inputValue.trim() === "") return undefined;
        const numVal = +inputValue;
        if (isNaN(numVal)) return undefined;
        return Math.floor(numVal);
    },
} as const;

// 🔤 Text & Font
export const FONT_SIZE_PROPERTY = getCommonInputStyle("fontSize");
export const FONT_FAMILY_PROPERTY = getCommonInputStyle("fontFamily");
export const FONT_WEIGHT_PROPERTY: IStylePropertyDef<string | number> = {
    description: "",
    key: "fontWeight",
    editorType: "input",
    converter(inputValue) {
        const val = inputValue.trim();
        if (val === "") return undefined;

        const numVal = +val;
        if (!isNaN(numVal)) return numVal;

        return val;
    },
} as const;
export const LINE_HEIGHT_PROPERTY: IStylePropertyDef<string | number> = {
    description: "",
    key: "lineHeight",
    editorType: "input",
    converter(inputValue) {
        const val = inputValue.trim();
        if (val === "") return undefined;

        const numVal = +val;
        if (!isNaN(numVal)) return numVal;

        return val;
    },
} as const;
export const TEXT_ALIGN_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "textAlign",
    editorType: "select",
    selectOptions: [
        { text: "", value: "" },
        { text: "Left", value: "left" },
        { text: "Center", value: "center" },
        { text: "Right", value: "right" },
        { text: "Justify", value: "justify" },
    ],
    converter: defaultStringConverter
} as const;
export const TEXT_DECORATION_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "textDecoration",
    editorType: "select",
    selectOptions: [
        { text: "", value: "" },
        { text: "Underline", value: "underline" },
        { text: "Overline", value: "overline" },
        { text: "Line Through", value: "line-through" },
    ],
    converter: defaultStringConverter
} as const;
export const TEXT_TRANSFORM_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "textTransform",
    editorType: "select",
    selectOptions: [
        { text: "", value: "" },
        { text: "Uppercase", value: "uppercase" },
        { text: "Lowercase", value: "lowercase" },
        { text: "Capitalize", value: "capitalize" },
    ],
    converter: defaultStringConverter
} as const;
export const LETTER_SPACING_PROPERTY = getCommonInputStyle("letterSpacing");

// 🧱 Flexbox
export const FLEX_DIRECTION_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "flexDirection",
    editorType: "select",
    selectOptions: [
        { text: "", value: "" },
        { text: "Row", value: "row" },
        { text: "Row Reverse", value: "row-reverse" },
        { text: "Column", value: "column" },
        { text: "Column Reverse", value: "column-reverse" },
    ],
    converter: defaultStringConverter
} as const;
export const JUSTIFY_CONTENT_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "justifyContent",
    editorType: "select",
    selectOptions: [
        { text: "", value: "" },
        { text: "Flex Start", value: "flex-start" },
        { text: "Flex End", value: "flex-end" },
        { text: "Center", value: "center" },
        { text: "Space Between", value: "space-between" },
        { text: "Space Around", value: "space-around" },
        { text: "Space Evenly", value: "space-evenly" },
    ],
    converter: defaultStringConverter
} as const;
export const ALIGN_ITEMS_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "alignItems",
    editorType: "select",
    selectOptions: [
        { text: "", value: "" },
        { text: "Stretch", value: "stretch" },
        { text: "Flex Start", value: "flex-start" },
        { text: "Flex End", value: "flex-end" },
        { text: "Center", value: "center" },
        { text: "Baseline", value: "baseline" },
    ],
    converter: defaultStringConverter
} as const;
export const ALIGN_CONTENT_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "alignContent",
    editorType: "select",
    selectOptions: [
        { text: "", value: "" },
        { text: "Stretch", value: "stretch" },
        { text: "Flex Start", value: "flex-start" },
        { text: "Flex End", value: "flex-end" },
        { text: "Center", value: "center" },
        { text: "Space Between", value: "space-between" },
        { text: "Space Around", value: "space-around" },
    ],
    converter: defaultStringConverter
} as const;
export const FLEX_WRAP_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "flexWrap",
    editorType: "select",
    selectOptions: [
        { text: "", value: "" },
        { text: "No Wrap", value: "nowrap" },
        { text: "Wrap", value: "wrap" },
        { text: "Wrap Reverse", value: "wrap-reverse" },
    ],
    converter: defaultStringConverter
} as const;
export const GAP_PROPERTY = getCommonInputStyle("gap");

// 🧩 Grid
export const GRID_TEMPLATE_COLUMNS_PROPERTY = getCommonInputStyle("gridTemplateColumns");
export const GRID_TEMPLATE_ROWS_PROPERTY = getCommonInputStyle("gridTemplateRows");
export const GRID_COLUMN_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "gridColumn",
    editorType: "input",
    converter(inputValue) {
        const val = inputValue.trim();
        if (val === "") return undefined;
        return val;
    },
} as const;
export const GRID_ROW_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "gridRow",
    editorType: "input",
    converter(inputValue) {
        const val = inputValue.trim();
        if (val === "") return undefined;
        return val;
    },
} as const;


// 🎭 Effects
export const BOX_SHADOW_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "boxShadow",
    editorType: "input",
    converter(inputValue) {
        const val = inputValue.trim();
        if (val === "") return undefined;
        return val;
    },
} as const;
export const TEXT_SHADOW_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "textShadow",
    editorType: "input",
    converter(inputValue) {
        const val = inputValue.trim();
        if (val === "") return undefined;
        return val;
    },
} as const;
export const BORDER_RADIUS_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "borderRadius",
    editorType: "input",
    converter(inputValue) {
        const val = inputValue.trim();
        if (val === "") return undefined;
        return val;
    },
} as const;
export const FILTER_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "filter",
    editorType: "select",
    selectOptions: [
        { text: "", value: "" },
        { text: "Blur", value: "blur(4px)" },
        { text: "Brightness", value: "brightness(1.2)" },
        { text: "Contrast", value: "contrast(1.2)" },
        { text: "Grayscale", value: "grayscale(1)" },
        { text: "Sepia", value: "sepia(1)" },
        { text: "Invert", value: "invert(1)" },
        { text: "Drop Shadow", value: "drop-shadow(0 2px 6px rgba(0,0,0,0.2))" },
    ],
    converter: defaultStringConverter
} as const;

// 🎬 Animation & Transition
export const TRANSITION_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "transition",
    editorType: "input",
    converter(inputValue) {
        const val = inputValue.trim();
        if (val === "") return undefined;
        return val;
    },
} as const;
export const TRANSITION_DURATION_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "transitionDuration",
    editorType: "select",
    selectOptions: [
        { text: "", value: "" },
        { text: "100ms", value: "100ms" },
        { text: "200ms", value: "200ms" },
        { text: "300ms", value: "300ms" },
        { text: "500ms", value: "500ms" },
        { text: "1s", value: "1s" },
    ],
    converter: defaultStringConverter
} as const;
export const TRANSFORM_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "transform",
    editorType: "input",
    converter(inputValue) {
        const val = inputValue.trim();
        if (val === "") return undefined;
        return val;
    },
} as const;
export const ANIMATION_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "animation",
    editorType: "input",
    converter(inputValue) {
        const val = inputValue.trim();
        if (val === "") return undefined;
        return val;
    },
} as const;
export const ANIMATION_DURATION_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "animationDuration",
    editorType: "select",
    selectOptions: [
        { text: "", value: "" },
        { text: "100ms", value: "100ms" },
        { text: "200ms", value: "200ms" },
        { text: "300ms", value: "300ms" },
        { text: "500ms", value: "500ms" },
        { text: "1s", value: "1s" },
    ],
    converter: defaultStringConverter
} as const;
export const ANIMATION_DELAY_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "animationDelay",
    editorType: "select",
    selectOptions: [
        { text: "", value: "" },
        { text: "0ms", value: "0ms" },
        { text: "100ms", value: "100ms" },
        { text: "200ms", value: "200ms" },
        { text: "500ms", value: "500ms" },
        { text: "1s", value: "1s" },
    ],
    converter: defaultStringConverter
} as const;

// 🖱️ Interaction
export const CURSOR_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "cursor",
    editorType: "select",
    selectOptions: [
        { text: "", value: "" },
        { text: "Pointer", value: "pointer" },
        { text: "Default", value: "default" },
        { text: "Text", value: "text" },
        { text: "Move", value: "move" },
        { text: "Not Allowed", value: "not-allowed" },
        { text: "Grab", value: "grab" },
        { text: "Grabbing", value: "grabbing" },
        { text: "Crosshair", value: "crosshair" },
        { text: "Wait", value: "wait" },
        { text: "Help", value: "help" },
    ],
    converter: defaultStringConverter
} as const;
export const POINTER_EVENTS_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "pointerEvents",
    editorType: "select",
    selectOptions: [
        { text: "", value: "" },
        { text: "Auto", value: "auto" },
        { text: "None", value: "none" },
    ],
    converter: defaultStringConverter
} as const;
export const USER_SELECT_PROPERTY: IStylePropertyDef = {
    description: "",
    key: "userSelect",
    editorType: "select",
    selectOptions: [
        { text: "", value: "" },
        { text: "Auto", value: "auto" },
        { text: "None", value: "none" },
        { text: "Text", value: "text" },
        { text: "All", value: "all" },
    ],
    converter: defaultStringConverter
} as const;

// List all properties
export const STYLE_PROPERTY_DEFS: IStylePropertyDef<unknown>[] = [
    NONE_PROPERTY,

    WIDTH_PROPERTY,
    HEIGHT_PROPERTY,
    MARGIN_PROPERTY,

    ALIGN_CONTENT_PROPERTY,
    ALIGN_ITEMS_PROPERTY,
    ANIMATION_DELAY_PROPERTY,
    ANIMATION_DURATION_PROPERTY,
    ANIMATION_PROPERTY,

    BACKGROUND_COLOR_PROPERTY,
    BACKGROUND_IMAGE_PROPERTY,
    BACKGROUND_POSITION_PROPERTY,
    BACKGROUND_PROPERTY,
    BORDER_PROPERTY,
    BORDER_RADIUS_PROPERTY,
    BOTTOM_PROPERTY,
    BOX_SHADOW_PROPERTY,
    BOX_SIZING_PROPERTY,

    COLOR_PROPERTY,
    CURSOR_PROPERTY,

    DISPLAY_PROPERTY,

    FILTER_PROPERTY,
    FLEX_DIRECTION_PROPERTY,
    FLEX_WRAP_PROPERTY,
    FONT_FAMILY_PROPERTY,
    FONT_SIZE_PROPERTY,
    FONT_WEIGHT_PROPERTY,

    GAP_PROPERTY,
    GRID_COLUMN_PROPERTY,
    GRID_ROW_PROPERTY,
    GRID_TEMPLATE_COLUMNS_PROPERTY,
    GRID_TEMPLATE_ROWS_PROPERTY,

    JUSTIFY_CONTENT_PROPERTY,

    LEFT_PROPERTY,
    LETTER_SPACING_PROPERTY,
    LINE_HEIGHT_PROPERTY,

    MAX_HEIGHT_PROPERTY,
    MAX_WIDTH_PROPERTY,
    MIN_HEIGHT_PROPERTY,
    MIN_WIDTH_PROPERTY,

    OPACITY_PROPERTY,
    OVERFLOW_PROPERTY,

    PADDING_PROPERTY,
    POINTER_EVENTS_PROPERTY,
    POSITION_PROPERTY,

    RIGHT_PROPERTY,

    TEXT_ALIGN_PROPERTY,
    TEXT_DECORATION_PROPERTY,
    TEXT_SHADOW_PROPERTY,
    TEXT_TRANSFORM_PROPERTY,
    TOP_PROPERTY,
    TRANSFORM_PROPERTY,
    TRANSITION_DURATION_PROPERTY,
    TRANSITION_PROPERTY,

    USER_SELECT_PROPERTY,

    Z_INDEX_PROPERTY,
] as const;

export const STYLE_PROPERTY_MAP: Record<string, IStylePropertyDef<unknown>> = (() => {
    const rs: Record<string, IStylePropertyDef<unknown>> = {};
    for (const def of STYLE_PROPERTY_DEFS) {
        rs[def.key] = def;
    }
    return rs;
})();