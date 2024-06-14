import Content, { CreateContentFromObject } from "../runtime/content.js";
import Resource from "./resource.js";
import Struct, { StructPath } from "./struct.js";
import UserDefinedType from "./userDefinedType.js";
import { GenericProperties, Struct as RuntimeStruct } from "../runtime/struct.js";

export function normalizeMapEntry(key: string): string {
    return key.toLowerCase();
}

export const moduleSuperType = "application/spec";
export const mediaTypeSeparator = "."

/**
 * PackagePath contains the scope of the package
 */
export class PackagePath {
    readonly namespace: string;
    readonly name: string;
    /**
     * mediaTypeSubType returns the media type sub type for the package
     * as in application/spec.<namespace>.<module>
     */
    readonly mediaTypeSubType: string;
    constructor(namespace: string, name: string) {
        this.namespace = normalizeMapEntry(namespace);
        this.name = normalizeMapEntry(name);
        this.mediaTypeSubType = `${moduleSuperType}.${this.namespace}.${this.name}`;
    }

    toString() {
        return this.mediaTypeSubType;
    }
}

/**
 * Package
 */
export default class Package {
    readonly path: PackagePath;
    private readonly resources: Resource[] = [];
    private readonly types: UserDefinedType[] = [];

    public annotations: any[] = [];

    /**
     * allPackages is a list of all packages including this and all imported
     */
    private allPackages: Package[] = [];
    private structsByFQTN: Map<string, Struct> = new Map();

    constructor(namespace: string, module: string) {
        this.path = new PackagePath(
            namespace,
            module,
        )
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
            this.structsByFQTN.set(normalizeMapEntry(tp.path.mediaType), tp);
        }
    }
    /**
     * Returns the Struct with the given FQTN, otherwise throws an error @TypeNotFoundError
     * @param fqtn 
     * @returns 
     */
    structByFQTN(structPath: StructPath,): Struct {
        const mediaType = normalizeMapEntry(structPath.mediaType);
        for (const pkg of this.allPackages) {
            const struct = pkg.structsByFQTN.get(mediaType);
            if (struct) {
                return struct;
            }
        }
        throw new TypeNotFoundError(structPath.mediaType);
    }

    buildByFQTN(structPath: StructPath, content: Content): RuntimeStruct {
        const structMeta = this.structByFQTN(structPath);
        const struct = {
            ...structMeta.deserialize(content),
            __structPath: structPath,
        } as RuntimeStruct;
        return struct;
    }

    requireBuildFromJSON(structPath: StructPath, structJSON: Record<string, any> | object | any): RuntimeStruct {
        const responseContent = CreateContentFromObject(structJSON);
        if (!responseContent) {
            throw new Error("failed to create content from malformed JSON");
        }
        return this.requireBuildByFQTN(structPath, responseContent);
    }

    requireBuildByFQTN(structPath: StructPath, content: Content): RuntimeStruct {
        const st = this.buildByFQTN(structPath, content);
        if (!st) {
            throw new Error(`failed to build struct ${structPath}`);
        }
        return st;
    }

    requireBuildArrayNullableItems(structPath: StructPath, contentArray: (Content | null)[]): (GenericProperties | null)[] {
        const stArray: (GenericProperties | null)[] = [];
        for (const content of contentArray) {
            if (content == null) {
                stArray.push(null);
                continue;
            }
            const st = this.requireBuildByFQTN(structPath, content);
            stArray.push(st);
        }
        return stArray;
    }
    requireBuildArrayNonNullableItems(structPath: StructPath, contentArray: (Content | null)[]): GenericProperties[] {
        const stArray: GenericProperties[] = [];
        for (const [index, value] of contentArray.entries()) {
            const content = value;
            if (content == null) {
                throw new Error(`failed to build struct at index ${index}, unexpected null item`);
            }
            const st = this.requireBuildByFQTN(structPath, content);
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