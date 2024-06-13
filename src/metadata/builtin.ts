import Package from "./package.js";
import Property from "./property.js";
import Struct from "./struct.js";

export class BuiltinMetaInfo {
    readonly Module: Package
    readonly ErrMeta: Struct
    constructor(module: Package, errMeta: Struct) {
        this.Module = module;
        this.ErrMeta = errMeta;
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

const _meta = new BuiltinMetaInfo(
    _pkg,
    builtinErrMeta,
)

/**
 * Returns the bultin protocol package
 * @returns the Package instance
 */
export function BuiltinMeta(): BuiltinMetaInfo {
    return _meta;
}