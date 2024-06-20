import Package from "./package.js";
import UserDefinedType from "./userDefinedType.js";

export default class Enum implements UserDefinedType {
    readonly name: string;
    readonly package: Package;
    readonly constants: string[] = [];
    readonly defaultConstant: string;
    constructor(pkg: Package, name: string, constants: string[]) {
        this.package = pkg;
        this.name = name;
        this.constants = constants;
        const defaultConstant = constants[0];
        if (!defaultConstant) {
            throw new Error(`Enum ${name} must have at least one constant`);
        }
        this.defaultConstant = defaultConstant;
        pkg._addType(this);
    }
}
