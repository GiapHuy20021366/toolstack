import { z } from "zod";
import { CTsTypeManager, ITsTypeDef } from "./type-manager";

const makeValidator = (name: string, schema: z.ZodTypeAny) => {
  return (value: unknown): string[] => {
    const result = schema.safeParse(value);

    if (!result.success) {
      return [`${JSON.stringify(value)} is not assignable to ${name}`];
    }

    return [];
  };
};

export const numberType = z.number();
export const tsNumberTypeDef: ITsTypeDef = {
  name: "number",
  type: numberType,
  validator(value) {
    if (!numberType.safeParse(value)) {
      return [`${value} is not assignable to ${"number"}`];
    } else {
      return [];
    }
  },
} as const;
CTsTypeManager.registerType(tsNumberTypeDef);

export const stringType = z.string();
export const tsStringTypeDef: ITsTypeDef = {
  name: "string",
  type: stringType,
  validator: makeValidator("string", stringType),
} as const;
CTsTypeManager.registerType(tsStringTypeDef);

export const booleanType = z.boolean();
export const tsBooleanTypeDef: ITsTypeDef = {
  name: "boolean",
  type: booleanType,
  validator: makeValidator("boolean", booleanType),
} as const;
CTsTypeManager.registerType(tsBooleanTypeDef);

export const anyArrayType = z.array(z.any());
export const tsAnyArrayTypeDef: ITsTypeDef = {
  name: "array",
  type: anyArrayType,
  validator: makeValidator("array", anyArrayType),
} as const;
CTsTypeManager.registerType(tsAnyArrayTypeDef);

export const objectType = z.object();
export const tsObjectTypeDef: ITsTypeDef = {
  name: "object",
  type: objectType,
  validator: makeValidator("object", objectType),
} as const;
CTsTypeManager.registerType(tsObjectTypeDef);

export const functionType = z.function();
export const tsFunctionTypeDef: ITsTypeDef = {
  name: "function",
  type: functionType,
  validator: makeValidator("function", functionType),
} as const;
CTsTypeManager.registerType(tsFunctionTypeDef);

export const unknownType = z.unknown();
export const tsUnknownTypeDef: ITsTypeDef = {
  name: "unknown",
  type: unknownType,
  validator: makeValidator("unknown", unknownType),
} as const;
CTsTypeManager.registerType(tsUnknownTypeDef);

export const anyType = z.any();
export const tsAnyTypeDef: ITsTypeDef = {
  name: "any",
  type: anyType,
  validator: makeValidator("any", anyType),
} as const;
CTsTypeManager.registerType(tsAnyTypeDef);

export const neverType = z.never();
export const tsNeverTypeDef: ITsTypeDef = {
  name: "never",
  type: neverType,
  validator: makeValidator("never", neverType),
} as const;
CTsTypeManager.registerType(tsNeverTypeDef);

export const voidType = z.void();
export const tsVoidTypeDef: ITsTypeDef = {
  name: "void",
  type: voidType,
  validator: makeValidator("void", voidType),
} as const;
CTsTypeManager.registerType(tsVoidTypeDef);

export const undefinedType = z.undefined();
export const tsUndefinedTypeDef: ITsTypeDef = {
  name: "undefined",
  type: undefinedType,
  validator: makeValidator("undefined", undefinedType),
} as const;
CTsTypeManager.registerType(tsUndefinedTypeDef);

export const nullType = z.null();
export const tsNullTypeDef: ITsTypeDef = {
  name: "null",
  type: nullType,
  validator: makeValidator("null", nullType),
} as const;
CTsTypeManager.registerType(tsNullTypeDef);

export const dateType = z.date();
export const tsDateTypeDef: ITsTypeDef = {
  name: "Date",
  type: dateType,
  validator: makeValidator("Date", dateType),
} as const;
CTsTypeManager.registerType(tsDateTypeDef);
