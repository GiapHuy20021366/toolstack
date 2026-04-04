import { TypeEntry, ValidateResult } from "../utils/type-system";

export interface ITypeSystemAPI {
  validateType(text: string, native?: boolean): Promise<ValidateResult>;
  registerType(type: TypeEntry): Promise<ValidateResult>;
  removeType(name: string): Promise<void>;
  clearTypes(): Promise<void>;
  listTypes(): Promise<TypeEntry[]>;
  isAssignable(typeA: string, typeB: string): Promise<ValidateResult>;
  isEqual(typeA: string, typeB: string): Promise<boolean>;
  getAllTypes(): Promise<string[]>;
}

export interface IElectronAPI {
  typeSystem: ITypeSystemAPI;
}
