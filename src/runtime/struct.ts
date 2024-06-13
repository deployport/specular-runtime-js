import Package from "../metadata/package.js";
import { StructPath } from "../metadata/struct.js";
import Content from "./content.js";

/**
 * HydrateContext is used to hydrate a struct from a content
 */
export class HydrateContext {
    readonly content: Content;
    readonly package: Package;
    constructor(content: Content, pkg: Package) {
        this.content = content;
        this.package = pkg;
    }
}

type ExplicitRecord<K extends keyof any, T> = {
    [P in K]: { value: T }
};

export interface StructInterface {
    __structPath: StructPath;
}

export type GenericProperties = ExplicitRecord<string, any>;
export type SerializedProperties = ExplicitRecord<string, any>;
export type Struct = GenericProperties & StructInterface;