import { Project, SourceFile, Diagnostic } from "ts-morph";
import ts from "typescript";

export interface ValidateResult {
  valid: boolean;
  errors: string[];
}

export interface TypeEntry {
  name: string;
  def: string;
  // Native definition
  native: boolean;
}

const PRIMITIVE_TYPES: string[] = [
  "string",
  "number",
  "boolean",
  "bigint",
  "symbol",
  "undefined",
  "null",
  "void",
  "any",
  "unknown",
  "never",
  "object",
  "function",
] as const;

export class TypeSystem {
  private static _instance: TypeSystem;

  public static get instance() {
    return (TypeSystem._instance ??= new TypeSystem());
  }

  private project: Project;
  private checkFile: SourceFile;
  private typesFile: SourceFile;
  private definedMap: Map<string, TypeEntry>;

  private constructor() {
    this.definedMap = new Map();

    this.project = new Project({
      compilerOptions: {
        strict: true,
        target: ts.ScriptTarget.ESNext,
        module: ts.ModuleKind.ESNext,
        lib: ["esnext"],
        skipLibCheck: true,
      },
    });

    // User defined
    this.typesFile = this.project.createSourceFile("__types__.ts", "", {
      overwrite: true,
    });

    // For type checking
    this.checkFile = this.project.createSourceFile("__typecheck__.ts", "", {
      overwrite: true,
    });

    // Register primitive type
    for (const type of PRIMITIVE_TYPES) {
      this.registerType({
        def: "",
        name: type,
        native: true,
      });
    }
  }

  /**
   * @API
   * Type registration
   * @param type
   * @returns
   */
  registerType(type: TypeEntry): ValidateResult {
    const validation = this.validateType(type.def, type.native);
    if (!validation.valid) return validation;

    this.definedMap.set(type.name, type);
    this.refreshTypesFile();

    return { valid: true, errors: [] };
  }

  /**
   * @API
   * Type remove
   * @param name
   */
  removeType(name: string) {
    this.definedMap.delete(name);
    this.refreshTypesFile();
  }

  /**
   * @API
   * Type clear
   */
  clearTypes() {
    this.definedMap.clear();
    this.refreshTypesFile();
  }

  /**
   * @API
   * List types
   * @returns
   */
  listTypes(): TypeEntry[] {
    return [...this.definedMap.values()];
  }

  /**
   * @API
   * Get all types
   * @returns
   */
  getAllTypes(): string[] {
    // warm up program
    if (!this.checkFile.getFullText().trim()) {
      this.checkFile.replaceWithText("let __warmup!: number;");
    }

    this.project.getTypeChecker();

    const checker = this.project.getTypeChecker();

    const symbols = checker.compilerObject.getSymbolsInScope(
      this.checkFile.compilerNode,
      ts.SymbolFlags.Type,
    );

    const result = new Set<string>();

    for (const sym of symbols) {
      const name = sym.getName();
      if (!name.startsWith("__")) {
        result.add(name);
      }
    }

    for (const name of this.definedMap.keys()) {
      result.add(name);
    }

    return [...result].sort();
  }

  /**
   * @API
   * Validate type
   * @param typeText
   * @param native
   * @returns
   */
  validateType(typeText: string, native = false): ValidateResult {
    let checkContent: string = this.typesFile.getFullText();
    if (native) {
      checkContent += "\n" + typeText;
    } else {
      checkContent += "\n" + `let __x!: ${typeText};`;
    }
    const temp = this.project.createSourceFile(
      "__validate__.ts",
      checkContent,
      { overwrite: true },
    );

    const diagnostics = this.project
      .getPreEmitDiagnostics()
      .filter((d) => d.getSourceFile() === temp);

    temp.delete();

    return {
      valid: diagnostics.length === 0,
      errors: diagnostics.map((d) => this.formatDiagnostic(d)),
    };
  }

  /**
   * @API
   * Type assignable
   * @param typeA
   * @param typeB
   * @returns
   */
  isAssignable(typeA: string, typeB: string): ValidateResult {
    const code = `
    let __a!: ${typeA};
    let __b!: ${typeB};
    __b = __a;
    `;

    this.checkFile.replaceWithText(code);

    const diagnostics = this.project
      .getPreEmitDiagnostics()
      .filter((d) => d.getSourceFile() === this.checkFile);

    return {
      valid: diagnostics.length === 0,
      errors: diagnostics.map((d) => this.formatDiagnostic(d)),
    };
  }

  /**
   * @API
   * Type equal check
   * @param typeA
   * @param typeB
   * @returns
   */
  isEqual(typeA: string, typeB: string): boolean {
    return this.isAssignable(typeA, typeB).valid && this.isAssignable(typeB, typeA).valid;
  }

  private refreshTypesFile() {
    const content = [...this.definedMap.values()]
      .map(({ def, name, native }) => {
        if (native) {
          return def;
        } else {
          return `type ${name} = ${def};`;
        }
      })
      .join("\n");
    this.typesFile.replaceWithText(content);
  }

  private formatDiagnostic(d: Diagnostic): string {
    const msg = d.getMessageText();
    return typeof msg === "string" ? msg : msg.getMessageText();
  }
}
