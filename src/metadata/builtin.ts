import { StructInterface } from "../runtime/struct.js";
import Package from "./package.js";
import Property from "./property.js";
import Struct from "./struct.js";

export class BuiltinMetaInfo {
    readonly Module: Package
    readonly ErrMeta: Struct
    readonly HeartbeatMeta: Struct
    constructor(module: Package, errMeta: Struct, builtinHeartbeatMeta: Struct) {
        this.Module = module;
        this.ErrMeta = errMeta;
        this.HeartbeatMeta = builtinHeartbeatMeta;
    }
}

const _pkg = new Package(
    "spec",
    "proto",
);

const builtinErrMeta = new Struct(
    _pkg,
    "err",
);
new Property(builtinErrMeta, "message", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "string"
});
new Property(builtinErrMeta, "resource", {
    NonNullable: false,
    SubType: "builtin",
    Builtin: "string"
});
new Property(builtinErrMeta, "operation", {
    NonNullable: false,
    SubType: "builtin",
    Builtin: "string"
});
new Property(builtinErrMeta, "code", {
    NonNullable: false,
    SubType: "builtin",
    Builtin: "string"
});

type ErrProperties = {
    message: string
    resource?: string
    operation?: string
    code?: string
}

export interface Err extends ErrProperties, StructInterface { };
export class Err
    extends Error { }
builtinErrMeta.problemInstantiate = (msg: string) => new Err(msg);



const builtinHeartbeatMeta = new Struct(
    _pkg,
    "hb",
);

const _meta = new BuiltinMetaInfo(
    _pkg,
    builtinErrMeta,
    builtinHeartbeatMeta,
)

/**
 * Returns the bultin protocol package
 * @returns the Package instance
 */
export function BuiltinMeta(): BuiltinMetaInfo {
    return _meta;
}