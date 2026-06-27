import {
    Runtime,
    Metadata,
} from '@deployport/specular-runtime';

const _pkg = new Metadata.Package(
    "specularjs", 
    "testpackage",
);

/** Enum metadata
*/
export const BodyTypeMeta = new Metadata.Enum(
    _pkg,
     "BodyType", 
     [
        "normal",
        "special",
     ]
);

/** enum BodyType
*/
export enum BodyType {
    /** enum constant Normal
*/
    Normal = "normal",
    /** enum constant Special
*/
    Special = "special",
}
/** Struct metadata
*/
export const BodyMeta = new Metadata.Struct(
    _pkg, 
    "Body", 
);
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
/** struct Body
*/
export interface BodyProperties {
    /** bodyType property
*/
    bodyType : BodyType
    /** bodyTypeNullable property
*/
    bodyTypeNullable : BodyType| null
    /** contentLengthFloat32 property
*/
    contentLengthFloat32 : number
    /** contentLengthFloat64 property
*/
    contentLengthFloat64 : number
    /** contentLengthFloat64Nullable property
*/
    contentLengthFloat64Nullable : number| null
    /** contentLengthInt32 property
*/
    contentLengthInt32 : number
    /** contentLengthInt64 property
*/
    contentLengthInt64 : number
    /** contentLengthUint32 property
*/
    contentLengthUint32 : number
    /** contentLengthUint64 property
*/
    contentLengthUint64 : number
    /** contentLengthUint64Nullable property
*/
    contentLengthUint64Nullable : number
    /** createdAt property
*/
    createdAt : Date
    /** createdAtNullable property
*/
    createdAtNullable : Date| null
    /** fileData property
*/
    fileData : Blob
    /** fileDataNullable property
*/
    fileDataNullable : Blob| null
    /** messageString property
*/
    messageString : string
    /** messageStringNullable property
*/
    messageStringNullable : string| null
}
/** struct Body
*/
export interface Body extends BodyProperties, Runtime.StructInterface {}
/** Struct metadata
*/
export const ResponseMeta = new Metadata.Struct(
    _pkg, 
    "Response", 
);
new Metadata.Property(ResponseMeta, "body", {
NonNullable: false,
SubType: "userDefined",
Type: SpecularPackage().requireTypeByName("Body")
});
/** struct Response
*/
export interface ResponseProperties {
    /** body property
*/
    body : BodyProperties| null
}
/** struct Response
*/
export interface Response extends ResponseProperties, Runtime.StructInterface {}
/** Struct metadata
*/
export const NotFoundProblemMeta = new Metadata.Struct(
    _pkg, 
    "NotFoundProblem", 
);
new Metadata.Property(NotFoundProblemMeta, "detail", {
NonNullable: true,
SubType: "builtin",
Builtin: "string"
});
new Metadata.Property(NotFoundProblemMeta, "message", {
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
/** struct NotFoundProblem
*/
export interface NotFoundProblemProperties {
    /** detail property
*/
    detail : string
    /** message property
*/
    message : string
    /** status property
*/
    status : number
    /** title property
*/
    title : string
}
/** struct NotFoundProblem
*/
export class NotFoundProblem extends Runtime.RpcError implements NotFoundProblemProperties, Runtime.StructInterface {
    detail : string = ''
    status : number = 0
    title : string = ''
    get __structPath(): Metadata.StructPath {
        return NotFoundProblemMeta.path
    }
}
NotFoundProblemMeta.problemInstantiate = (msg: string) => new NotFoundProblem(msg);
/** Struct metadata
*/
export const TestHTTPGetInputMeta = new Metadata.Struct(
    _pkg, 
    "TestHTTPGetInput", 
);
/** struct TestHTTPGetInput
*/
export interface TestHTTPGetInputProperties {
}
/** struct TestHTTPGetInput
*/
export interface TestHTTPGetInput extends TestHTTPGetInputProperties, Runtime.StructInterface {}
/** Struct metadata
*/
export const TestHTTPGetOutputMeta = new Metadata.Struct(
    _pkg, 
    "TestHTTPGetOutput", 
);
new Metadata.Property(TestHTTPGetOutputMeta, "response", {
NonNullable: false,
SubType: "userDefined",
Type: SpecularPackage().requireTypeByName("Response")
});
/** struct TestHTTPGetOutput
*/
export interface TestHTTPGetOutputProperties {
    /** response property
*/
    response : ResponseProperties| null
}
/** struct TestHTTPGetOutput
*/
export interface TestHTTPGetOutput extends TestHTTPGetOutputProperties, Runtime.StructInterface {}
/** Struct metadata
*/
export const TestHTTPOtherInputMeta = new Metadata.Struct(
    _pkg, 
    "TestHTTPOtherInput", 
);
/** struct TestHTTPOtherInput
*/
export interface TestHTTPOtherInputProperties {
}
/** struct TestHTTPOtherInput
*/
export interface TestHTTPOtherInput extends TestHTTPOtherInputProperties, Runtime.StructInterface {}
/** Struct metadata
*/
export const TestHTTPOtherOutputMeta = new Metadata.Struct(
    _pkg, 
    "TestHTTPOtherOutput", 
);
/** struct TestHTTPOtherOutput
*/
export interface TestHTTPOtherOutputProperties {
}
/** struct TestHTTPOtherOutput
*/
export interface TestHTTPOtherOutput extends TestHTTPOtherOutputProperties, Runtime.StructInterface {}
/** Struct metadata
*/
export const TestHTTPWatchChangesInputMeta = new Metadata.Struct(
    _pkg, 
    "TestHTTPWatchChangesInput", 
);
/** struct TestHTTPWatchChangesInput
*/
export interface TestHTTPWatchChangesInputProperties {
}
/** struct TestHTTPWatchChangesInput
*/
export interface TestHTTPWatchChangesInput extends TestHTTPWatchChangesInputProperties, Runtime.StructInterface {}
/** Struct metadata
*/
export const TestHTTPWatchChangesOutputMeta = new Metadata.Struct(
    _pkg, 
    "TestHTTPWatchChangesOutput", 
);
new Metadata.Property(TestHTTPWatchChangesOutputMeta, "response", {
NonNullable: false,
SubType: "userDefined",
Type: SpecularPackage().requireTypeByName("Response")
});
/** struct TestHTTPWatchChangesOutput
*/
export interface TestHTTPWatchChangesOutputProperties {
    /** response property
*/
    response : ResponseProperties| null
}
/** struct TestHTTPWatchChangesOutput
*/
export interface TestHTTPWatchChangesOutput extends TestHTTPWatchChangesOutputProperties, Runtime.StructInterface {}

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


// TestHTTPResourceClient is the TestHTTPResourceClient resource client
class TestHTTPResourceClient {
    private readonly client: Runtime.Client;
    constructor(client: Runtime.Client) {
        this.client = client;
    }
    /** operation Get
*/
    async Get(inputProps: TestHTTPGetInputProperties): Promise<TestHTTPGetOutput> {
        const res = await this.client.execute(_testHTTPGetOperationMeta, inputProps);
        return res as unknown as TestHTTPGetOutput;
    }
    /** operation Other
*/
    async Other(inputProps: TestHTTPOtherInputProperties): Promise<TestHTTPOtherOutput> {
        const res = await this.client.execute(_testHTTPOtherOperationMeta, inputProps);
        return res as unknown as TestHTTPOtherOutput;
    }
    /** operation WatchChanges
*/
    async WatchChanges(inputProps: TestHTTPWatchChangesInputProperties, outputCallback: (output: TestHTTPWatchChangesOutput) => Promise<void>) {
        await this.client.stream(_testHTTPWatchChangesOperationMeta, inputProps, async (output) => {
            await outputCallback(output as unknown as TestHTTPWatchChangesOutput);
        });
    }
}
export function defaultRuntimeConfig(): Runtime.ClientConfig {
    return {
        endpoint: "http://localhost:8080",
    } as Runtime.ClientConfig;
}

export function createRuntimeClientConfig(config?: Partial<Runtime.ClientConfig>): Runtime.ClientConfig {
    const c = Runtime.MergeClientConfig(defaultRuntimeConfig(), config); 
    return c;
}

export function createRuntimeClient(config?: Partial<Runtime.ClientConfig>): Runtime.Client {
    return new Runtime.Client(createRuntimeClientConfig(config))
}

export type ClientConfig = {
    client?: Runtime.Client
};

export type Config = ClientConfig & Runtime.ClientConfig;
/**
 * @class Client class for package testpackage
 */
export class Client {
    private readonly client: Runtime.Client;
    /** resource TestHTTP client
*/
    public readonly TestHTTP: TestHTTPResourceClient;
    constructor(config?: Config) {
        if(config?.client) {
            this.client = config.client;
        } else {
            this.client = createRuntimeClient(config);
        }
this.TestHTTP = new TestHTTPResourceClient(this.client);
    }
}
