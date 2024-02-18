import Package from "../metadata/package.js";
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

export interface StructInterface {
    __type: string;
}

export type GenericProperties = Record<string, any>;
export type SerializedProperties = Record<string, any>;

export interface Struct {
    readonly fqtn: string;
    dehydrate(content: Content): Promise<void>;
    hydrate(context: HydrateContext): void;
    toContent(): Promise<Content>
}

export async function StructToContent(st: Struct | null): Promise<Content | null> {
    if (!st) {
        return null;
    }
    return await st.toContent();
}

export async function StructsToContent(structs: (Struct | null)[] | null): Promise<(Content | null)[] | null> {
    if (!structs) {
        return null;
    }

    const contents: (Content | null)[] = [];
    for (const struct of structs) {
        if (!struct) {
            contents.push(null);
            continue;
        }
        contents.push(await struct.toContent());
    }
    return contents;
}