// JS gen package
import { Runtime, Metadata, } from '../../lib/index.js';
const _pkg = new Metadata.Package("specularjs", "testpackage");
export const BodyMeta = new Metadata.Struct(_pkg, "Body");
new Metadata.Property(BodyMeta, "contentLength", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "int32"
});
export const ResponseMeta = new Metadata.Struct(_pkg, "Response");
new Metadata.Property(ResponseMeta, "body", {
    NonNullable: false,
    SubType: "userDefined",
    Type: SpecularPackage().requireTypeByName("Body")
});
export const NotFoundProblemMeta = new Metadata.Struct(_pkg, "NotFoundProblem");
new Metadata.Property(NotFoundProblemMeta, "detail", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "string"
});
new Metadata.Property(NotFoundProblemMeta, "status", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "int32"
});
new Metadata.Property(NotFoundProblemMeta, "title", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "string"
});
new Metadata.Property(NotFoundProblemMeta, "message", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "string"
});
export class NotFoundProblem extends Error {
    detail;
    status;
    title;
    message;
    get __structPath() {
        return NotFoundProblemMeta.path;
    }
}
NotFoundProblemMeta.problemInstantiate = (msg) => new NotFoundProblem(msg);
export const TestHTTPGetInputMeta = new Metadata.Struct(_pkg, "TestHTTPGetInput");
export const TestHTTPGetOutputMeta = new Metadata.Struct(_pkg, "TestHTTPGetOutput");
new Metadata.Property(TestHTTPGetOutputMeta, "response", {
    NonNullable: false,
    SubType: "userDefined",
    Type: SpecularPackage().requireTypeByName("Response")
});
export const TestHTTPOtherInputMeta = new Metadata.Struct(_pkg, "TestHTTPOtherInput");
export const TestHTTPOtherOutputMeta = new Metadata.Struct(_pkg, "TestHTTPOtherOutput");
export const TestHTTPWatchChangesInputMeta = new Metadata.Struct(_pkg, "TestHTTPWatchChangesInput");
export const TestHTTPWatchChangesOutputMeta = new Metadata.Struct(_pkg, "TestHTTPWatchChangesOutput");
new Metadata.Property(TestHTTPWatchChangesOutputMeta, "response", {
    NonNullable: false,
    SubType: "userDefined",
    Type: SpecularPackage().requireTypeByName("Response")
});
export function SpecularPackage() {
    return _pkg;
}
const _testHTTPResourceMeta = new Metadata.Resource(_pkg, "TestHTTP", null);
const _testHTTPGetOperationMeta = new Metadata.Operation({
    resource: _testHTTPResourceMeta,
    name: "Get",
    input: TestHTTPGetInputMeta,
    output: TestHTTPGetOutputMeta,
});
const _testHTTPOtherOperationMeta = new Metadata.Operation({
    resource: _testHTTPResourceMeta,
    name: "Other",
    input: TestHTTPOtherInputMeta,
    output: TestHTTPOtherOutputMeta,
});
const _testHTTPWatchChangesOperationMeta = new Metadata.Operation({
    resource: _testHTTPResourceMeta,
    name: "WatchChanges",
    input: TestHTTPWatchChangesInputMeta,
    output: TestHTTPWatchChangesOutputMeta,
});
// TestHTTPResource is the TestHTTPResource resource client
class TestHTTPResource {
    client;
    constructor(client) {
        this.client = client;
    }
    async Get(inputProps) {
        const res = await this.client.execute(_testHTTPGetOperationMeta, inputProps);
        return res;
    }
    async Other(inputProps) {
        const res = await this.client.execute(_testHTTPOtherOperationMeta, inputProps);
        return res;
    }
    async WatchChanges(inputProps, outputCallback) {
        await this.client.stream(_testHTTPWatchChangesOperationMeta, inputProps, async (output) => {
            await outputCallback(output);
        });
    }
}
export function defaultRuntimeConfig() {
    return {
        endpoint: "http://localhost:8080",
    };
}
export function createRuntimeClientConfig(config) {
    const c = Runtime.MergeClientConfig(defaultRuntimeConfig(), config);
    return c;
}
export function createRuntimeClient(config) {
    return new Runtime.Client(createRuntimeClientConfig(config));
}
/**
 * @class Client class for package testpackage
 */
export class Client {
    client;
    TestHTTP;
    constructor(config) {
        if (config?.client) {
            this.client = config.client;
        }
        else {
            this.client = createRuntimeClient(config);
        }
        console.log("client initialized from allow");
        this.TestHTTP = new TestHTTPResource(this.client);
    }
}
