// JS gen package
import {
    Runtime,
    Metadata,
} from '../../lib/index.js';

const _pkg = new Metadata.Package(
    "specularjs", 
    "testpackage",
);

export const BodyMeta = new Metadata.Struct(
    _pkg, 
    "Body", 
);
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
// Body entity
export interface BodyProperties {
    // /**
    // * Returns "specularjs/testpackage.Body"
    // */
    // fqtn: "specularjs/testpackage.Body";
    contentLengthFloat32 : number
    contentLengthFloat64 : number
    contentLengthFloat64Nullable : number| null
    contentLengthInt32 : number
    contentLengthInt64 : number
    contentLengthUint32 : number
    contentLengthUint64 : number
    contentLengthUint64Nullable : number
    createdAt : Date
    createdAtNullable : Date| null
    messageString : string
    messageStringNullable : string| null
}
export interface Body extends BodyProperties, Runtime.StructInterface {}
export const ResponseMeta = new Metadata.Struct(
    _pkg, 
    "Response", 
);
new Metadata.Property(ResponseMeta, "body", {
NonNullable: false,
SubType: "userDefined",
Type: SpecularPackage().requireTypeByName("Body")
});
// Response entity
export interface ResponseProperties {
    // /**
    // * Returns "specularjs/testpackage.Response"
    // */
    // fqtn: "specularjs/testpackage.Response";
    body : BodyProperties| null
}
export interface Response extends ResponseProperties, Runtime.StructInterface {}
export const NotFoundProblemMeta = new Metadata.Struct(
    _pkg, 
    "NotFoundProblem", 
);
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
// NotFoundProblem entity
export interface NotFoundProblemProperties {
    // /**
    // * Returns "specularjs/testpackage.NotFoundProblem"
    // */
    // fqtn: "specularjs/testpackage.NotFoundProblem";
    detail : string
    status : number
    title : string
    message : string
}
export class NotFoundProblem extends Error implements NotFoundProblemProperties, Runtime.StructInterface {
    detail : string = ''
    status : number = 0
    title : string = ''
    message : string = ''
    get __structPath(): Metadata.StructPath {
        return NotFoundProblemMeta.path
    }
}
NotFoundProblemMeta.problemInstantiate = (msg: string) => new NotFoundProblem(msg);
export const TestHTTPGetInputMeta = new Metadata.Struct(
    _pkg, 
    "TestHTTPGetInput", 
);
// TestHTTPGetInput entity
export interface TestHTTPGetInputProperties {
    // /**
    // * Returns "specularjs/testpackage.TestHTTPGetInput"
    // */
    // fqtn: "specularjs/testpackage.TestHTTPGetInput";
}
export interface TestHTTPGetInput extends TestHTTPGetInputProperties, Runtime.StructInterface {}
export const TestHTTPGetOutputMeta = new Metadata.Struct(
    _pkg, 
    "TestHTTPGetOutput", 
);
new Metadata.Property(TestHTTPGetOutputMeta, "response", {
NonNullable: false,
SubType: "userDefined",
Type: SpecularPackage().requireTypeByName("Response")
});
// TestHTTPGetOutput entity
export interface TestHTTPGetOutputProperties {
    // /**
    // * Returns "specularjs/testpackage.TestHTTPGetOutput"
    // */
    // fqtn: "specularjs/testpackage.TestHTTPGetOutput";
    response : ResponseProperties| null
}
export interface TestHTTPGetOutput extends TestHTTPGetOutputProperties, Runtime.StructInterface {}
export const TestHTTPOtherInputMeta = new Metadata.Struct(
    _pkg, 
    "TestHTTPOtherInput", 
);
// TestHTTPOtherInput entity
export interface TestHTTPOtherInputProperties {
    // /**
    // * Returns "specularjs/testpackage.TestHTTPOtherInput"
    // */
    // fqtn: "specularjs/testpackage.TestHTTPOtherInput";
}
export interface TestHTTPOtherInput extends TestHTTPOtherInputProperties, Runtime.StructInterface {}
export const TestHTTPOtherOutputMeta = new Metadata.Struct(
    _pkg, 
    "TestHTTPOtherOutput", 
);
// TestHTTPOtherOutput entity
export interface TestHTTPOtherOutputProperties {
    // /**
    // * Returns "specularjs/testpackage.TestHTTPOtherOutput"
    // */
    // fqtn: "specularjs/testpackage.TestHTTPOtherOutput";
}
export interface TestHTTPOtherOutput extends TestHTTPOtherOutputProperties, Runtime.StructInterface {}
export const TestHTTPWatchChangesInputMeta = new Metadata.Struct(
    _pkg, 
    "TestHTTPWatchChangesInput", 
);
// TestHTTPWatchChangesInput entity
export interface TestHTTPWatchChangesInputProperties {
    // /**
    // * Returns "specularjs/testpackage.TestHTTPWatchChangesInput"
    // */
    // fqtn: "specularjs/testpackage.TestHTTPWatchChangesInput";
}
export interface TestHTTPWatchChangesInput extends TestHTTPWatchChangesInputProperties, Runtime.StructInterface {}
export const TestHTTPWatchChangesOutputMeta = new Metadata.Struct(
    _pkg, 
    "TestHTTPWatchChangesOutput", 
);
new Metadata.Property(TestHTTPWatchChangesOutputMeta, "response", {
NonNullable: false,
SubType: "userDefined",
Type: SpecularPackage().requireTypeByName("Response")
});
// TestHTTPWatchChangesOutput entity
export interface TestHTTPWatchChangesOutputProperties {
    // /**
    // * Returns "specularjs/testpackage.TestHTTPWatchChangesOutput"
    // */
    // fqtn: "specularjs/testpackage.TestHTTPWatchChangesOutput";
    response : ResponseProperties| null
}
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


// TestHTTPResource is the TestHTTPResource resource client
class TestHTTPResource {
    private readonly client: Runtime.Client;
    constructor(client: Runtime.Client) {
        this.client = client;
    }
    async Get(inputProps: TestHTTPGetInputProperties): Promise<TestHTTPGetOutput> {
        const res = await this.client.execute(_testHTTPGetOperationMeta, inputProps);
        return res as unknown as TestHTTPGetOutput;
    }
    async Other(inputProps: TestHTTPOtherInputProperties): Promise<TestHTTPOtherOutput> {
        const res = await this.client.execute(_testHTTPOtherOperationMeta, inputProps);
        return res as unknown as TestHTTPOtherOutput;
    }
    async WatchChanges(inputProps: TestHTTPWatchChangesInputProperties, outputCallback: (TestHTTPWatchChangesOutput) => Promise<void>) {
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
    public readonly TestHTTP: TestHTTPResource;
    constructor(config?: Config) {
        if(config?.client) {
            this.client = config.client;
        } else {
            this.client = createRuntimeClient(config);
        }
        console.log("client initialized from allow");
this.TestHTTP = new TestHTTPResource(this.client);
    }
}
