/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  z,
  ZodType,
  ZodString,
  ZodNumber,
  ZodBoolean,
  ZodNull,
  ZodLiteral,
  ZodArray,
  ZodTuple,
  ZodUnion,
  ZodOptional,
  ZodNullable,
  ZodRecord,
  ZodObject,
} from "zod";

type AnySchema = z.ZodType<unknown>;

function unwrap(schema: AnySchema): AnySchema {
  const s: any = schema;

  if (s._def?.innerType) return unwrap(s._def.innerType);
  if (s._def?.schema) return unwrap(s._def.schema);

  return schema;
}

function getShape(def: any) {
  return typeof def.shape === "function" ? def.shape() : def.shape;
}

function getArrayElement(def: any) {
  return def.element ?? def.type; // v4 → element, v3 fallback
}

export function isAssignable(A: AnySchema, B: AnySchema): boolean {
  A = unwrap(A);
  B = unwrap(B);

  // Any type check
  if (B instanceof z.ZodAny) {
    return true;
  }

  // Array vs Array
  if (A instanceof z.ZodArray && B instanceof z.ZodArray) {
    return isAssignable(
      getArrayElement((A as any)._def),
      getArrayElement((B as any)._def),
    );
  }

  // Object vs Object
  if (A instanceof z.ZodObject && B instanceof z.ZodObject) {
    const aShape = getShape((A as any)._def);
    const bShape = getShape((B as any)._def);

    for (const key in bShape) {
      if (!(key in aShape)) return false;
      if (!isAssignable(aShape[key], bShape[key])) return false;
    }

    return true;
  }

  // Literature vs Literature
  if (A instanceof z.ZodLiteral && B instanceof z.ZodLiteral) {
    const aDef = (A as any)._def;
    const bDef = (B as any)._def;
    return aDef.values.every((aValue: unknown) =>
      bDef.values.some((bValue: unknown) => aValue === bValue),
    );
  }

  // Union
  if (A instanceof z.ZodUnion) {
    return (A as any)._def.options.every((opt: AnySchema) =>
      isAssignable(opt, B),
    );
  }
  if (B instanceof z.ZodUnion) {
    return (B as any)._def.options.some((opt: AnySchema) =>
      isAssignable(A, opt),
    );
  }

  // Intersection
  if (B instanceof z.ZodIntersection) {
    const def: any = B._def;
    return isAssignable(A, def.left) && isAssignable(A, def.right);
  }

  // Function
  if (A instanceof z.ZodFunction && B instanceof z.ZodFunction) {
    const aDef: any = A._def;
    const bDef: any = B._def;

    const aArgs = aDef.input._def.items.map(unwrap);
    const bArgs = bDef.input._def.items.map(unwrap);

    // arity check
    if (aArgs.length !== bArgs.length) return false;

    // args — contravariant
    for (let i = 0; i < aArgs.length; i++) {
      if (!isAssignable(aArgs[i], bArgs[i])) {
        return false;
      }
    }

    // return — covariant
    return isAssignable(unwrap(aDef.output), unwrap(bDef.output));
  }

  /* ---------- PRIMITIVE ---------- */

  return A.constructor === B.constructor;
}

export type TypeDef =
  | { kind: "string" }
  | { kind: "number" }
  | { kind: "boolean" }
  | { kind: "null" }
  | { kind: "literal"; value: unknown }
  | { kind: "array"; element: TypeDef }
  | { kind: "tuple"; items: TypeDef[] }
  | { kind: "union"; options: TypeDef[] }
  | { kind: "optional"; inner: TypeDef }
  | { kind: "nullable"; inner: TypeDef }
  | { kind: "record"; value: TypeDef }
  | { kind: "object"; shape: Record<string, TypeDef> };

function asZod(schema: unknown): z.ZodTypeAny {
  return schema as z.ZodTypeAny;
}

export function toDef(schema: ZodType): TypeDef {
  if (schema instanceof ZodString) return { kind: "string" };

  if (schema instanceof ZodNumber) return { kind: "number" };

  if (schema instanceof ZodBoolean) return { kind: "boolean" };

  if (schema instanceof ZodNull) return { kind: "null" };

  if (schema instanceof ZodLiteral) {
    return {
      kind: "literal",
      value: (schema as any).value,
    };
  }

  if (schema instanceof ZodArray) {
    const element = asZod(schema.element);

    return {
      kind: "array",
      element: toDef(element),
    };
  }

  if (schema instanceof ZodTuple) {
    const def = (schema as any)._def;

    return {
      kind: "tuple",
      items: def.items.map((i: unknown) => toDef(asZod(i))),
    };
  }

  if (schema instanceof ZodUnion) {
    const def = (schema as any)._def;

    return {
      kind: "union",
      options: def.options.map((o: unknown) => toDef(asZod(o))),
    };
  }

  if (schema instanceof ZodOptional)
    return {
      kind: "optional",
      inner: toDef(asZod(schema.unwrap())),
    };

  if (schema instanceof ZodNullable)
    return {
      kind: "nullable",
      inner: toDef(asZod(schema.unwrap())),
    };

  if (schema instanceof ZodRecord) {
    const def = (schema as any)._def;

    return {
      kind: "record",
      value: toDef(asZod(def.valueType)),
    };
  }

  if (schema instanceof ZodObject) {
    const shape = schema.shape;
    const result: Record<string, TypeDef> = {};

    for (const key in shape) {
      result[key] = toDef(asZod(shape[key]));
    }

    return { kind: "object", shape: result };
  }

  throw new Error("Unsupported schema type " + schema);
}

function wrapUnion(s: string) {
  return s.includes("|") ? `(${s})` : s;
}

function unwrapOptional(def: TypeDef) {
  if (def.kind === "optional") {
    return { optional: true, inner: def.inner };
  }

  return { optional: false, inner: def };
}
export function printType(def: TypeDef): string {
  switch (def.kind) {
    case "string":
    case "number":
    case "boolean":
    case "null":
      return def.kind;

    case "literal": {
      return JSON.stringify(def.value);
    }

    case "optional":
      return printType(def.inner) + "?";

    case "nullable":
      return printType(def.inner) + " | null";

    case "array":
      return `array<${wrapUnion(printType(def.element))}>`;

    case "tuple":
      return `[${def.items.map(printType).join(", ")}]`;

    case "union":
      return def.options.map(printType).join(" | ");

    case "record":
      return `record<string, ${printType(def.value)}>`;

    case "object": {
      const fields = Object.entries(def.shape)
        .map(([key, value]) => {
          const { optional, inner } = unwrapOptional(value);

          return `${key}${optional ? "?" : ""}: ${printType(inner)}`;
        })
        .join("; ");
      return `{ ${fields} }`;
    }
  }
}
