import Operation from "./operation.js";
import Package from "./package.js";

export default class Resource {
    public readonly name: string;
    public readonly package: Package;
    public readonly parent: Resource | null;
    private readonly operations: Operation[] = [];
    private readonly resources: Resource[] = [];
    public readonly packageUniqueName: string;

    constructor(pkg: Package, name: string, parent: Resource | null = null) {
        this.name = name;
        this.package = pkg;
        this.parent = parent;
        if (parent) {
            parent._addResource(this);
            this.packageUniqueName = parent.packageUniqueName + name;
        } else {
            pkg._addResource(this);
            this.packageUniqueName = name;
        }
    }
    operationByName(name: string) {
        return this.operations.find(operation => operation.name === name);
    }
    _addOperation(operation: Operation) {
        if (this.operationByName(operation.name)) {
            throw new Error(`duplicate operation name ${operation.name}`);
        }
        this.operations.push(operation);
    }

    _addResource(resource: Resource) {
        if (this.resourceByName(resource.name)) {
            throw new Error(`duplicate resource name ${resource.name}`);
        }
        this.resources.push(resource);
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
}
