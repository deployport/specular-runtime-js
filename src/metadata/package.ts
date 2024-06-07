import Content, { CreateContentFromObject } from "../runtime/content.js";
import Resource from "./resource.js";
import Struct from "./struct.js";
import UserDefinedType from "./userDefinedType.js";
import { GenericProperties } from "../runtime/struct.js";

function normalizeMapEntry(key: string): string {
    return key.toLowerCase();
}

/**
 * Package
 */
export default class Package {
    public readonly path: string;
    private readonly resources: Resource[] = [];
    private readonly types: UserDefinedType[] = [];

    public annotations: any[] = [];

    /**
     * allPackages is a list of all packages including this and all imported
     */
    private allPackages: Package[] = [];
    private structsByFQTN: Map<string, Struct> = new Map();

    constructor(path: string) {
        this.path = path;
        this.allPackages.push(this);
    }

    importPackage(pkg: Package) {
        this.allPackages.push(pkg);
    }

    _addAnnotation<T>(annotation: T, config?: (annotation: T) => void) {
        config?.(annotation);
        this.annotations = this.annotations || [];
        this.annotations.push(annotation);
    }

    /**
     * Resource by name returns the resource with the given name
     * or undefined if not found
     * @param name name of the resource
     * @returns 
     */
    resourceByName(name: string): Resource | null {
        name = normalizeMapEntry(name)
        return this.resources.find(resource => normalizeMapEntry(resource.name) === name) || null;
    }

    _addResource(resource: Resource) {
        if (this.resourceByName(resource.name)) {
            throw new Error(`duplicate resource name ${resource.name}`);
        }
        this.resources.push(resource);
    }
    typeByName(name: string): UserDefinedType | null {
        name = normalizeMapEntry(name);
        return this.types.find(struct => normalizeMapEntry(struct.name) === name) || null;
    }
    requireTypeByName(name: string): UserDefinedType {
        const st = this.typeByName(name);
        if (!st) {
            throw new Error(`failed to find user defined type ${name}`);
        }
        return st;
    }
    _addType(tp: UserDefinedType) {
        if (this.typeByName(tp.name)) {
            throw new Error(`duplicate type name ${tp.name}`);
        }
        this.types.push(tp);
        if (tp instanceof Struct) {
            this.structsByFQTN.set(normalizeMapEntry(tp.fqtn), tp);
        }
    }
    /**
     * Returns the Struct with the given FQTN, otherwise throws an error @TypeNotFoundError
     * @param fqtn 
     * @returns 
     */
    structByFQTN(fqtn: string): Struct {
        // fqtn = normalizeMapEntry(fqtn);
        for (const pkg of this.allPackages) {
            const struct = pkg.structsByFQTN.get(fqtn);
            if (struct) {
                return struct;
            }
        }
        throw new TypeNotFoundError(fqtn);
    }

    buildByFQTN(fqtn: string, content: Content): GenericProperties {
        const structMeta = this.structByFQTN(fqtn);
        const struct = structMeta.deserialize(content)
        return struct;
    }

    requireBuildFromJSON(structJSON: Record<string, any> | object | any): GenericProperties {
        const responseContent = CreateContentFromObject(structJSON);
        if (!responseContent) {
            throw new Error("failed to create content from malformed JSON");
        }
        const fqdn = responseContent.fqtn;
        return this.requireBuildByFQTN(fqdn, responseContent);
    }

    requireBuildByFQTN(fqdn: string, content: Content): GenericProperties {
        const st = this.buildByFQTN(fqdn, content);
        if (!st) {
            throw new Error(`failed to build struct ${fqdn}`);
        }
        return st;
    }

    requireBuildArrayNullableItems(contentArray: (Content | null)[]): (GenericProperties | null)[] {
        const stArray: (GenericProperties | null)[] = [];
        for (const content of contentArray) {
            if (content == null) {
                stArray.push(null);
                continue;
            }
            const st = this.requireBuildByFQTN(content.fqtn, content);
            stArray.push(st);
        }
        return stArray;
    }
    requireBuildArrayNonNullableItems(contentArray: (Content | null)[]): GenericProperties[] {
        const stArray: GenericProperties[] = [];
        for (const [index, value] of contentArray.entries()) {
            const content = value;
            if (content == null) {
                throw new Error(`failed to build struct at index ${index}, unexpected null item`);
            }
            const st = this.requireBuildByFQTN(content.fqtn, content);
            stArray.push(st);
        }
        return stArray;
    }
}

export class TypeNotFoundError extends Error {
    constructor(typeName: string) {
        super(`failed to find type ${typeName}`);
    }
}