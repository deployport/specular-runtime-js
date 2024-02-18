import Content, { CreateContentFromObject } from "../runtime/content.js";
import Resource from "./resource.js";
import Struct from "./struct.js";
import UserDefinedType from "./userDefinedType.js";
import { GenericProperties } from "../runtime/struct.js";

/**
 * Package
 */
export default class Package {
    public readonly path: string;
    private readonly resources: Resource[] = [];
    private readonly types: UserDefinedType[] = [];
    public annotations: any[] = [];

    constructor(path: string) {
        this.path = path;
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
        return this.resources.find(resource => resource.name === name) || null;
    }

    _addResource(resource: Resource) {
        if (this.resourceByName(resource.name)) {
            throw new Error(`duplicate resource name ${resource.name}`);
        }
        this.resources.push(resource);
    }
    typeByName(name: string): UserDefinedType | null {
        return this.types.find(struct => struct.name === name) || null;
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
    }
    get structs(): Struct[] {
        return this.types.filter(struct => struct instanceof Struct) as Struct[];
    }
    structByFQTN(fqtn: string): Struct | null {
        return this.structs.find(struct => struct.fqtn === fqtn) || null;
    }
    buildByFQTN(fqtn: string, content: Content): GenericProperties | null {
        const structMeta = this.structByFQTN(fqtn);
        if (structMeta == null) {
            return null;
        }
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
