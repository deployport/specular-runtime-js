import Package from "./package.js";
import UserDefinedType from "./userDefinedType.js";

export default class Enum implements UserDefinedType {
    readonly name: string;
    readonly package: Package;
    readonly constants: string[] = [];
    constructor(pkg: Package, name: string, constants: string[]) {
        this.package = pkg;
        this.name = name;
        this.constants = constants;
        pkg._addType(this);
    }
}
