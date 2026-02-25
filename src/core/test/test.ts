import z from "zod";
import { isAssignable, printType, toDef } from "../utils/zod-utils";

function test(name: string, result: boolean, expected: boolean) {
  console.log(
    `${name}:`,
    result === expected ? "✅ PASS" : `❌ FAIL (got ${result})`,
  );
}

/* ---------------- */
/* OBJECT MATCHING */
/* ---------------- */

const A1 = z.object({ id: z.string(), age: z.number() });
const B1 = z.object({ id: z.string() });

test("object superset", isAssignable(A1, B1), true);

test("object missing field", isAssignable(B1, A1), false);

/* ---------------- */
/* NESTED OBJECT */
/* ---------------- */

const A2 = z.object({
  user: z.object({
    id: z.string(),
    age: z.number(),
  }),
});

const B2 = z.object({
  user: z.object({
    id: z.string(),
  }),
});

test("nested object", isAssignable(A2, B2), true);

/* ---------------- */
/* ARRAY */
/* ---------------- */

const A3 = z.array(z.number());
const B3 = z.array(z.number());

test("array same type", isAssignable(A3, B3), true);

const B3b = z.array(z.string());

test("array mismatch", isAssignable(A3, B3b), false);

/* ---------------- */
/* UNION */
/* ---------------- */

const A4 = z.string();
const B4 = z.union([z.string(), z.number()]);

test("primitive satisfies union", isAssignable(A4, B4), true);

const A4b = z.union([z.string(), z.number()]);
const B4b = z.string();

test("union to primitive", isAssignable(A4b, B4b), false);

/* ---------------- */
/* INTERSECTION */
/* ---------------- */

const A5 = z.object({ id: z.string(), age: z.number() });
const B5 = z.intersection(z.object({ id: z.string() }), z.object({}));

test("intersection", isAssignable(A5, B5), true);

/* ---------------- */
/* PRIMITIVE */
/* ---------------- */

test("primitive equal", isAssignable(z.string(), z.string()), true);

test("primitive mismatch", isAssignable(z.string(), z.number()), false);

/* ---------------- */
/* OPTIONAL */
/* ---------------- */

const A6 = z.object({
  id: z.string(),
  age: z.number(),
});

const B6 = z.object({
  id: z.string(),
  age: z.number().optional(),
});

test("optional compatibility", isAssignable(A6, B6), true);

/* ---------------- */
/* UNION OBJECT */
/* ---------------- */

const A7 = z.object({ id: z.string() });

const B7 = z.union([
  z.object({ id: z.string() }),
  z.object({ name: z.string() }),
]);

test("object satisfies union", isAssignable(A7, B7), true);

/* ---------------- */
/* DEEP ARRAY */
/* ---------------- */

const A8 = z.array(
  z.object({
    id: z.string(),
    age: z.number(),
  }),
);

const B8 = z.array(
  z.object({
    id: z.string(),
  }),
);

test("deep array object", isAssignable(A8, B8), true);

/* ---------------- */
/* FUNCTION (Zod v4) */
/* ---------------- */

// same signature
const F1 = z.function({
  input: [z.string()],
  output: z.number(),
});

const F1b = z.function({
  input: [z.string()],
  output: z.number(),
});

test("function same signature", isAssignable(F1, F1b), true);

// return mismatch
const F2 = z.function({
  input: [z.string()],
  output: z.string(),
});

test("function return mismatch", isAssignable(F1, F2), false);

// return covariance (literal -> wider)
const F3 = z.function({
  input: [],
  output: z.literal(1),
});

const F3b = z.function({
  input: [],
  output: z.number(),
});

test("function return covariance", isAssignable(F3, F3b), true);

// arg contravariance
const F4 = z.function({
  input: [z.union([z.string(), z.number()])],
  output: z.number(),
});

const F4b = z.function({
  input: [z.string()],
  output: z.number(),
});

test("function arg contravariance", isAssignable(F4b, F4), true);

// arg mismatch
const F5 = z.function({
  input: [z.string()],
  output: z.number(),
});

const F5b = z.function({
  input: [z.number()],
  output: z.number(),
});

test("function arg mismatch", isAssignable(F5, F5b), false);

// arity mismatch
const F6 = z.function({
  input: [z.string()],
  output: z.number(),
});

const F6b = z.function({
  input: [z.string(), z.number()],
  output: z.number(),
});

test("function arity mismatch", isAssignable(F6, F6b), false);

// union return covariance
const F7 = z.function({
  input: [],
  output: z.literal(1),
});

const F7b = z.function({
  input: [],
  output: z.union([z.number(), z.string()]),
});

test("function union return covariance", isAssignable(F7, F7b), true);

// union arg contravariance
const F8 = z.function({
  input: [z.string()],
  output: z.number(),
});

const F8b = z.function({
  input: [z.union([z.string(), z.boolean()])],
  output: z.number(),
});

test("function union arg contravariance", isAssignable(F8, F8b), true);

// zero-arg function
const F9 = z.function({
  input: [],
  output: z.string(),
});

const F9b = z.function({
  input: [],
  output: z.string(),
});

test("function zero arg", isAssignable(F9, F9b), true);

console.log(JSON.stringify(F9b));

const ComplexSchema = z.object({
  id: z.string(),
  version: z.literal(1),

  meta: z.object({
    version: z.literal(1),
    tags: z.array(
      z.union([
        z.string(),
        z.number(),
        z.object({
          label: z.string(),
          score: z.number().optional(),
        }),
      ]),
    ),
  }),

  config: z.union([
    z.object({
      mode: z.literal("simple"),
      retry: z.number().optional(),
    }),
    z.object({
      mode: z.literal("advanced"),
      pipeline: z.array(
        z.tuple([z.string(), z.boolean(), z.number().nullable()]),
      ),
    }),
  ]),

  cache: z.record(
    z.string(),
    z.union([z.string(), z.array(z.number()), z.null()]),
  ),

  flags: z
    .array(z.union([z.literal("A"), z.literal("B"), z.literal("C")]))
    .optional(),
});
const def = toDef(ComplexSchema);

console.log(printType(def));
