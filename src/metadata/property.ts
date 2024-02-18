import Struct from "./struct.js";
import { TypeRef } from "./typeRef.js";

export default class Property {
    readonly name: string;
    readonly struct: Struct;
    readonly type: TypeRef;
    constructor(st: Struct, name: string, type: TypeRef) {
        this.struct = st;
        this.name = name;
        this.type = type;
        this.struct._addProperty(this);
    }
}
