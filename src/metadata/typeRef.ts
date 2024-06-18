import UserDefinedType from "./userDefinedType.js";

export type BuiltinType = "string" | "float64" | "float32" | "bool" | "int32" | "uint32" | "int64" | "uint64" | "time" | "binary";

export function isIntegral(builtin: BuiltinType): boolean {
    return builtin === "int32" || builtin === "uint32" || builtin === "int64" || builtin === "uint64" || builtin === "float32" || builtin === "float64";
}

export type TypeBase = {
    SubType: "array" | "userDefined" | "builtin";
    NonNullable: boolean;
}

export type TypeRefUserDefined = TypeBase & {
    SubType: "userDefined";
    Type: UserDefinedType;
}

export type TypeRefArray = TypeBase & {
    SubType: "array";
    Item: TypeRef;
}

export type TypeRefBuiltin = TypeBase & {
    SubType: "builtin";
    Builtin: BuiltinType;
}

export type TypeRef = TypeRefArray | TypeRefBuiltin | TypeRefUserDefined;
