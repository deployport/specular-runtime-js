// JS gen package
import { Runtime, Metadata, } from '../../lib/index.js';
const _pkg = new Metadata.Package("specularjs", "testpackage");
// BodyType entity
export const BodyTypeMeta = new Metadata.Enum(_pkg, "BodyType", [
    "normal",
    "special",
]);
export var BodyType;
(function (BodyType) {
    BodyType["Normal"] = "normal";
    BodyType["Special"] = "special";
})(BodyType || (BodyType = {}));
export const BodyMeta = new Metadata.Struct(_pkg, "Body");
new Metadata.Property(BodyMeta, "bodyType", {
    NonNullable: true,
    SubType: "userDefined",
    Type: SpecularPackage().requireTypeByName("BodyType")
});
new Metadata.Property(BodyMeta, "bodyTypeNullable", {
    NonNullable: false,
    SubType: "userDefined",
    Type: SpecularPackage().requireTypeByName("BodyType")
});
new Metadata.Property(BodyMeta, "contentLengthFloat32", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "float32"
});
new Metadata.Property(BodyMeta, "contentLengthFloat64", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "float64"
});
new Metadata.Property(BodyMeta, "contentLengthFloat64Nullable", {
    NonNullable: false,
    SubType: "builtin",
    Builtin: "float64"
});
new Metadata.Property(BodyMeta, "contentLengthInt32", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "int32"
});
new Metadata.Property(BodyMeta, "contentLengthInt64", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "int64"
});
new Metadata.Property(BodyMeta, "contentLengthUint32", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "uint32"
});
new Metadata.Property(BodyMeta, "contentLengthUint64", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "uint64"
});
new Metadata.Property(BodyMeta, "contentLengthUint64Nullable", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "uint64"
});
new Metadata.Property(BodyMeta, "createdAt", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "time"
});
new Metadata.Property(BodyMeta, "createdAtNullable", {
    NonNullable: false,
    SubType: "builtin",
    Builtin: "time"
});
new Metadata.Property(BodyMeta, "fileData", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "binary"
});
new Metadata.Property(BodyMeta, "fileDataNullable", {
    NonNullable: false,
    SubType: "builtin",
    Builtin: "binary"
});
new Metadata.Property(BodyMeta, "messageString", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "string"
});
new Metadata.Property(BodyMeta, "messageStringNullable", {
    NonNullable: false,
    SubType: "builtin",
    Builtin: "string"
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
    detail = '';
    status = 0;
    title = '';
    message = '';
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
