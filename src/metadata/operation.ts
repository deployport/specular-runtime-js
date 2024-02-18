import Resource from "./resource.js";
import Struct from "./struct.js";

export default class Operation {
    public readonly name: string;
    public readonly resource: Resource;
    public readonly input: Struct;
    public readonly output: Struct;
    public annotations: any[] = [];

    constructor({ resource, name, input, output }: { resource: Resource, name: string, input: Struct, output: Struct }) {
        this.resource = resource;
        this.name = name;
        this.input = input;
        this.output = output;
        resource._addOperation(this);
    }

    _addAnnotation<T>(annotation: T, config?: (annotation: T) => void) {
        config?.(annotation);
        this.annotations = this.annotations || [];
        this.annotations.push(annotation);
    }
}
