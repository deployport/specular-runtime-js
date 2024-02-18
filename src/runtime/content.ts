export type Properties = Record<string, any>;

export function CreateContentFromObject(obj: any): Content | null {
    const fqtn = obj['__type'];
    if (fqtn == null) {
        return null;
    }
    return new Content(fqtn, obj);
}

export function CreateContentObjectArray(potentialArray: any): (Content | null)[] | null {
    if (!potentialArray) {
        return null;
    }
    if (!Array.isArray(potentialArray)) {
        return null;
    }
    const array = potentialArray as any[];
    const result: (Content | null)[] = [];
    for (const obj of array) {
        const content = CreateContentFromObject(obj);
        if (!content) {
            result.push(null);
            continue;
        }
        result.push(content);
    }
    return result;
}

export default class Content {
    public fqtn: string = '';
    properties?: Properties;

    constructor(fqtn?: string, properties?: Properties) {
        if (fqtn) {
            this.fqtn = fqtn;
        }
        if (properties) {
            this.properties = properties;
        } else {
            this.properties = {};
        }
    }

    setProperty(key: string, value: any) {
        if (this.properties == null) {
            this.properties = {};
        }
        this.properties[key] = value;
    }
    getProperty(key: string): any | null {
        if (this.properties == null) {
            return null;
        }
        return this.properties[key];
    }

    toJSON() {
        return {
            ...this.properties,
            "__type": this.fqtn,
        };
    }
}