import { IGraphicScreenResolution } from "./type";

export enum EGraphicEditorTabMenu {
    COMPONENT_MENU = "component-menu",
    TREE_MENU = "tree-menu",
    COMPONENT_STATE_MENU = "component-state-menu",
    COMPONENT_LAYOUT_MENU = "component-layout-menu",
    COMPONENT_INFO_MENU = "component-info-menu",
}

export const SCREEN_RESOLUTIONS: IGraphicScreenResolution[] = [
    // ===== Desktop / Laptop =====
    {
        id: "hd",
        width: 1280,
        height: 720,
        name: "HD (1280×720)",
    },
    {
        id: "hd_plus",
        width: 1600,
        height: 900,
        name: "HD+ (1600×900)",
    },
    {
        id: "full_hd",
        width: 1920,
        height: 1080,
        name: "Full HD (1920×1080)",
    },
    {
        id: "2k",
        width: 2560,
        height: 1440,
        name: "2K / QHD (2560×1440)",
    },
    {
        id: "4k",
        width: 3840,
        height: 2160,
        name: "4K / UHD (3840×2160)",
    },

    // ===== Apple =====
    {
        id: "macbook_air_13",
        width: 1440,
        height: 900,
        name: 'MacBook Air 13" (1440×900)',
    },
    {
        id: "macbook_pro_14",
        width: 3024,
        height: 1964,
        name: 'MacBook Pro 14" (3024×1964)',
    },
    {
        id: "macbook_pro_16",
        width: 3456,
        height: 2234,
        name: 'MacBook Pro 16" (3456×2234)',
    },

    // ===== Custom =====
    {
        id: "custom",
        width: 0,
        height: 0,
        name: "Custom",
    },
] as const;

export enum EGraphicEditorWorkspaceMode {
    VIEW = "view",
    EDIT = "edit"
}
