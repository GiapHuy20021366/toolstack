import { z } from "zod";
import { isAssignable, printType, toDef } from "../utils/zod-utils";

export interface ITsTypeDef {
  name: string;
  type: z.ZodType;
  validator: (value: unknown) => string[];
}

export class CTsTypeManager {
  private static typeDefMap: Map<string, ITsTypeDef> = new Map();
  private static assignableMap: Map<string, boolean> = new Map();
  private static typeDefPlainMap: Map<string, string> = new Map();

  public static registerType(typeDef: ITsTypeDef) {
    CTsTypeManager.typeDefMap.set(typeDef.name, typeDef);
  }

  public static getTypeDef(name: string) {
    return CTsTypeManager.typeDefMap.get(name);
  }

  public static getAllTypeNames() {
    return [...CTsTypeManager.typeDefMap.keys()];
  }

  public static getAllTypeDefs() {
    return [...CTsTypeManager.typeDefMap.values()];
  }

  private static toTypeMatchingKey(type1: ITsTypeDef, type2: ITsTypeDef) {
    const name1 = type1.name;
    const name2 = type2.name;
    if (name1.localeCompare(name2) < 0) {
      return `${name1}$$${name2}`;
    } else {
      return `${name2}$$${name1}`;
    }
  }
  /**
   * Is type1 matching type2?
   * @param type1
   * @param type2
   */
  public static isAssignable(type1: string, type2: string) {
    const typeDef1 = CTsTypeManager.getTypeDef(type1);
    const typeDef2 = CTsTypeManager.getTypeDef(type2);
    if (typeDef1 == null || typeDef2 == null) {
      return false;
    }
    const key = CTsTypeManager.toTypeMatchingKey(typeDef1, typeDef2);
    if (CTsTypeManager.assignableMap.has(key)) {
      return CTsTypeManager.assignableMap.get(key);
    } else {
      const rs = isAssignable(typeDef1.type, typeDef2.type);
      this.assignableMap.set(
        CTsTypeManager.toTypeMatchingKey(typeDef1, typeDef2),
        rs,
      );
      return rs;
    }
  }

  /**
   *
   * @param name
   * @returns
   */
  public static getTypeDefDisplay(name: string) {
    if (CTsTypeManager.typeDefPlainMap.has(name)) {
      return CTsTypeManager.typeDefPlainMap.get(name);
    } else {
      const typeDef = CTsTypeManager.getTypeDef(name);
      if (typeDef == null) {
        return "?";
      }
      try {
        const defJson = toDef(typeDef.type);
        const defPlain = printType(defJson);
        this.typeDefPlainMap.set(typeDef.name, defPlain);
        return defPlain;
      } catch (error) {
        console.error(error);
        return "?";
      }
    }
  }
}
