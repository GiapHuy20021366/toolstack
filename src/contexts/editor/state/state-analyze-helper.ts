import { EditorStateManager, makeEditorGraphicKey } from "./editor-state-manager";

enum EPatternDelimiter {
    PROPERTY_DELIMITER = ".",
    NAME_DELIMITER = "$",

    RESOLVE_DELIMITER = "?",
    SHORTCUT_DELIMITER = ":"
}

export const SHORT_CUT_MAP: Record<string, string> = {
    "?": "@state",
    "?st": "@state",
    "?gb": "@state.global",
    "?gp": "@graphic",
    "?ws": "@workspace.workspace",

    // Workspace
    ":info-cid": ".info.cid",
    ":info-name": ".info.name",
    ":info-desc": ".info.description",
    ":info-image": ".info.image",
    ":info-time": ".info.time",
    ":tmp-selected": ".temp.selected-cid",
    ":l-scale": ".layout.scale",
    ":l-width": ".layout.width",
    ":l-height": ".layout.height",
    ":l-resolution": ".layout.resolution",

    // Graphic
    ":d-layout": ".data.layout",
    ":d-cid": ".data.cid",
    ":d-name": ".data.name",
    ":d-desc": ".data.description",
    ":d-chid": ".data.children",
    ":d-visible": ".data.visible",
    ":d-classes": ".data.classes",
    ":d-style": ".data.style",

    // State value accessors
    ":": ".value",
    ":value": ".value",
    ":val": ".value",
    ":v": ".value",
    ":in": ".in",
    ":out": ".out",
    ":val-in": ".value.in",
    ":val-out": ".value.out"

} as const;

export const splitWithDelimiters = (
    input: string,
    delimiters: string[] = Object.values(EPatternDelimiter)
): string[] => {
    if (!input) return [];

    // Escape delimiter
    const escaped = delimiters.map(d =>
        d.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );

    const pattern = new RegExp(`(?=${escaped.join("|")})`);

    return input.split(pattern).filter(Boolean);
}

export const parseKey = (stateManager: EditorStateManager, key: string) => {
    const names: string[] = [];
    const nameKeys: string[] = [];
    const parts = splitWithDelimiters(key);
    const parsedParts: string[] = [];
    for (const part of parts) {
        if (part.startsWith(EPatternDelimiter.NAME_DELIMITER)) {
            const name = part.slice(1);
            const ids = stateManager.identifyStateHandler.getComponentCids(name);
            if (ids != null && ids.length > 0) {
                // Get the first element
                parsedParts.push(ids[0]);
                nameKeys.push(makeEditorGraphicKey(ids[0], "data.name"))
            } else {
                parsedParts.push(part);
            }
            names.push(name);
        } else if (
            part.startsWith(EPatternDelimiter.RESOLVE_DELIMITER)
            || part.startsWith(EPatternDelimiter.SHORTCUT_DELIMITER)
        ) {
            parsedParts.push(SHORT_CUT_MAP[part] ?? part);
        } else {
            parsedParts.push(part);
        }
    }
    return {
        rs: parsedParts.join(""),
        names: names,
        nameKeys: nameKeys
    };
};

type StateKeyPattern = (string | StateKeyPattern)[];

const parse = (input: string): StateKeyPattern => {
    const couples: [number, number][] = [];
    const opens: number[] = [];

    // Step 1: Collect all [start, end] index pairs
    for (let i = 0; i < input.length; i++) {
        if (input[i] === "[") {
            opens.push(i);
        } else if (input[i] === "]") {
            const start = opens.pop();
            // Important: must check against undefined (not falsy)
            if (start !== undefined) {
                couples.push([start, i]);
            }
        }
    }

    // Step 2: Sort pairs by start index (outer → inner order)
    couples.sort((a, b) => a[0] - b[0]);

    let idx = 0; // global pointer to current couple

    const build = (start: number, end: number): StateKeyPattern => {
        const result: StateKeyPattern = [];
        let cursor = start;

        while (cursor < end) {
            const couple = couples[idx];

            // CASE 1: current position is the start of a bracket pair "["
            if (couple && couple[0] === cursor) {
                idx++;

                // Recursively parse inside the bracket
                const nested = build(couple[0] + 1, couple[1]);
                result.push(nested);

                // Move cursor to the character after "]"
                cursor = couple[1] + 1;
                continue;
            }

            // CASE 2: plain string segment (outside brackets)
            let next = end;

            // If there is a next bracket, stop before it
            if (couple) {
                next = Math.min(next, couple[0]);
            }

            // Extract string between cursor and next boundary
            // This handles:
            // - text before a bracket
            // - text between two brackets
            // - text after the last bracket
            if (next > cursor) {
                const text = input.slice(cursor, next);
                result.push(text);
            }

            cursor = next;
        }

        return result;
    };

    return build(0, input.length);
};

export interface IDependencies {
    // Main dependency
    key: string;
    // Inner dependencies
    keys: string[];
    // Name dependencies
    names: string[];
}

export const analyzeDependencies = (
    stateManager: EditorStateManager,
    pattern: StateKeyPattern,
    dependencies: IDependencies,
) => {
    let finalKey = "";
    for (const k of pattern) {
        if (typeof k === "string") {
            const { names, rs, nameKeys } = parseKey(stateManager, k);
            dependencies.names.push(...names);
            dependencies.keys.push(...nameKeys);
            finalKey += rs;
        } else {
            const { key, value } = analyzeDependencies(stateManager, k, dependencies);
            const { names, rs, nameKeys } = parseKey(stateManager, value || key);
            finalKey += rs;
            dependencies.names.push(...names);
            dependencies.keys.push(...nameKeys);
            if (value != null) {
                dependencies.keys.push(key);
            }
        }
    }
    dependencies.key = finalKey;
    const value = stateManager.getValue(finalKey) || "";
    return {
        key: finalKey,
        value: value != null ? String(value) : null,
    };
};

export const analyzeInput = (stateManager: EditorStateManager, value: string) => {
    const pattern = parse(value);
    const dependencies: IDependencies = {
        key: "",
        keys: [],
        names: [],
    };
    analyzeDependencies(stateManager, pattern, dependencies);
    dependencies.keys = [...new Set(dependencies.keys)];
    dependencies.names = [...new Set(dependencies.names)];
    return dependencies;
};
