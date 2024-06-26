import { StructInterface } from "../runtime/struct.js";
import Package from "./package.js";
import Property from "./property.js";
import Struct, { StructPath } from "./struct.js";

const zeroTimeNum = Date.UTC(1, 0, 1, 0, 0, 0);

// returns a date equivalent to 0001-01-01 00:00:00 +0000 UTC
export function defaultZeroTime(): Date {
    return new Date(zeroTimeNum);
}

// returns true if the date is equivalent to 0001-01-01 00:00:00 +0000 UTC
// null and undefined are considered false
export function dateIsZeroTime(date: Date): boolean {
    return date.getTime() === zeroTimeNum;
}

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

export interface ErrProperties {
    message: string
    resource?: string
    operation?: string
    code?: string
}

export class Err extends Error implements ErrProperties, StructInterface {
    get __structPath(): StructPath {
        return builtinErrMeta.path
    }
}
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