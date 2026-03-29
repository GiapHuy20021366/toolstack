import { CTsStateManager } from "./state-manager";

const NAME_MAP: Record<string, string> = {
  ":state": "@state",
  ":graphic": "@graphic",
  ":global": "@state.global",
  ":workspace": "@workspace.workspace",
  ":selected-cid": "@workspace.workspace.temp.selected-cid",
  ":workspace-scale": "@workspace.workspace.layout.scale",
  ":workspace-resolution": "@workspace.workspace.layout.resolution",
} as const;

export const parseKey = (stateManager: CTsStateManager, key: string) => {
  const names: string[] = [];
  const parts = key.split(".");
  const parsedParts: string[] = [];
  for (const part of parts) {
    if (part.startsWith(":")) {
      parsedParts.push(NAME_MAP[part] || part);
    } else if (part.startsWith("$")) {
      const name = part.slice(1);
      const ids = stateManager.identifyStateHandler.getComponentCids(name);
      if (ids != null && ids.length > 0) {
        // Get the first element
        parsedParts.push(ids[0]);
      } else {
        parsedParts.push(part);
      }
      names.push(name);
    } else {
      parsedParts.push(part);
    }
  }
  return {
    rs: parsedParts.join("."),
    names: names,
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

export const parsePattern = (input: string): StateKeyPattern => {
  const stack: StateKeyPattern[] = [[]];
  let buffer = "";

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char === "[") {
      if (buffer) {
        stack[stack.length - 1].push(buffer);
        buffer = "";
      }

      const newLevel: StateKeyPattern = [];
      stack[stack.length - 1].push(newLevel);
      stack.push(newLevel);
    } else if (char === "]") {
      if (stack.length === 1) {
        buffer += char;
        continue;
      }

      if (buffer) {
        stack[stack.length - 1].push(buffer);
        buffer = "";
      }

      stack.pop();
    } else {
      buffer += char;
    }
  }

  if (buffer) {
    stack[stack.length - 1].push(buffer);
  }

  return stack[0];
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
  stateManager: CTsStateManager,
  pattern: StateKeyPattern,
  dependencies: IDependencies,
) => {
  let finalKey = "";
  for (const k of pattern) {
    if (typeof k === "string") {
      const { names, rs } = parseKey(stateManager, k);
      dependencies.names.push(...names);
      finalKey += rs;
    } else {
      const { key, value } = analyzeDependencies(stateManager, k, dependencies);
      const { names, rs } = parseKey(stateManager, value || key);
      finalKey += rs;
      dependencies.names.push(...names);
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

export const analyzeInput = (stateManager: CTsStateManager, value: string) => {
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
