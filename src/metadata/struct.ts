import Content from "../runtime/content.js";
import Package, { PackagePath, mediaTypeSeparator, moduleSuperType, normalizeMapEntry } from "./package.js";
import { GenericProperties, SerializedProperties } from "../runtime/struct.js";
import Property from "./property.js";
import UserDefinedType from "./userDefinedType.js";
import { TypeRef } from "./typeRef.js";
import Enum from "./enum.js";
import { BlobToBase64, ParseOptionalBinary } from "../runtime/builtin.js";

export class StructPath {
    readonly module: PackagePath;
    readonly name: string;
    readonly mediaType: string;
    constructor(module: PackagePath, name: string) {
        this.module = module;
        this.name = normalizeMapEntry(name);
        this.mediaType = `${module.mediaTypeSubType}.${name}`;
    }
    toString() {
        return this.mediaType;
    }

    // parses a content type like application/spec.<namespace>.<module>
    static fromString(str: string): StructPath {
        const parentMediaTypeIndex = normalizeMapEntry(str).indexOf(moduleSuperType);
        if (parentMediaTypeIndex === -1) {
            throw new Error(`invalid package path ${str}`);
        }
        const parts = str.slice(parentMediaTypeIndex + moduleSuperType.length + mediaTypeSeparator.length).split(mediaTypeSeparator);
        if (parts.length < 3) {
            throw new Error(`invalid package path ${str}`);
        }
        return new StructPath(new PackagePath(parts[0]!, parts[1]!), parts[2]!);
    }
}

export default class Struct implements UserDefinedType {
    readonly name: string;
    readonly package: Package;
    readonly path: StructPath;
    private readonly properties: Property[] = [];

    constructor(pkg: Package, name: string) {
        this.package = pkg;
        this.name = name;
        this.path = new StructPath(pkg.path, name);
        pkg._addType(this);
    }

    problemInstantiate: ((msg: string) => any) | null = null;

    instantiate(content: Content | null) {
        let st: any;
        if (this.problemInstantiate) {
            st = this.problemInstantiate(content?.getProperty("message") || '');
        } else {
            st = {};
        }
        return st;
    }

    get mediaType(): string {
        return this.package.path + ":" + this.name;
    }

    _addProperty(prop: Property) {
        if (this.propertyByName(prop.name)) {
            throw new Error(`duplicate property name ${prop.name}`);
        }
        this.properties.push(prop);
    }

    propertyByName(name: string): Property | null {
        return this.properties.find(p => p.name === name) || null;
    }

    /**
     * Returns properties ready to be send over the network.
     * Includes special property __type with the fqtn of the struct
     */
    async serialize(props: GenericProperties): Promise<SerializedProperties> {
        const json: SerializedProperties = {};
        for (const prop of this.properties) {
            const value = props[prop.name];
            if (value === undefined) {
                continue;
            }
            json[prop.name] = await serializeToJSON(prop.type, value);
        }
        return json;
    }
    deserialize(content: Content): GenericProperties {
        const struct: any = this.instantiate!(content)!;
        this.deserializeStruct(struct, content);
        return struct;
    }
    private deserializeStruct(struct: SerializedProperties, content: Content) {
        for (const prop of this.properties) {
            const value = content.getProperty(prop.name);
            if (value === undefined) {
                continue;
            }
            try {
                const propVal = deserializeFromJSON(prop.type, value);
                struct[prop.name] = propVal;
            } catch (e) {
                throw new Error(`failed to deserialize property '${prop.name}': ${e}`);
            }
        }
    }
}

async function serializeToJSON(typeRef: TypeRef, value: any): Promise<any> {
    switch (typeRef.SubType) {
        case "builtin":
            if (typeRef.Builtin === "time") {
                return value.toISOString();
            }
            else if (typeRef.Builtin == 'binary') {
                return await BlobToBase64(value);
            }
            break;
        case "userDefined":
            if (typeRef.Type instanceof Struct) {
                return typeRef.Type.serialize(value);
            } else if (typeRef.Type instanceof Enum) {
                // TODO: validate enum value
                return value;
            } else {
                throw new Error(`unexpected type ref user defined ${typeRef}`);
            }
        case "array":
            if (!value) {
                return null;
            }
            if (!Array.isArray(value)) {
                throw new Error(`expected array, got ${value}`);
            }
            return await Promise.all(value.map((v: any) => serializeToJSON(typeRef.Item, v)));
    }
    return value;
}

function deserializeFromJSON(typeRef: TypeRef, value: any): any {
    switch (typeRef.SubType) {
        case "builtin":
            if (typeRef.Builtin === "time") {
                return new Date(value);
            }
            else if (typeRef.Builtin == 'binary') {
                return ParseOptionalBinary(value);
            }
            break;
        case "userDefined":
            if (typeRef.NonNullable && (value == null || value == undefined)) {
                throw new Error(`expected non-nullable value, got ${value}`);
            }
            if (typeRef.Type instanceof Struct) {
                if (value === null) {
                    return null;
                }
                return typeRef.Type.package.requireBuildFromJSON(typeRef.Type.path, value);
            } else if (typeRef.Type instanceof Enum) {
                // TODO: validate enum value
                return value;
            } else {
                throw new Error(`unexpected type ref user defined ${typeRef}`);
            }
        case "array":
            if (!value) {
                return null;
            }
            if (!Array.isArray(value)) {
                throw new Error(`expected array, got ${value}`);
            }
            return value.map((v: any) => deserializeFromJSON(typeRef.Item, v));
    }
    return value;
}