// JS gen package
import {
    Runtime,
    Metadata,
} from '../../lib/index.js';

const _pkg = new Metadata.Package(
    'SpecularJS/TestPackage',
);

export const BodyMeta = new Metadata.Struct(
    _pkg, 
    "Body", 
);
new Metadata.Property(BodyMeta, "contentLength", {
NonNullable: true,
SubType: "builtin",
Builtin: "int32"
});
// Body entity
export interface BodyProperties
 {
    // /**
    // * Returns "SpecularJS/TestPackage:Body"
    // */
    // fqtn: "SpecularJS/TestPackage:Body";
    contentLength : number;
};
export interface Body extends BodyProperties, Runtime.StructInterface{};
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
export interface ResponseProperties
 {
    // /**
    // * Returns "SpecularJS/TestPackage:Response"
    // */
    // fqtn: "SpecularJS/TestPackage:Response";
    body : BodyProperties| null;
};
export interface Response extends ResponseProperties, Runtime.StructInterface{};
export const TestHTTPGetInputMeta = new Metadata.Struct(
    _pkg, 
    "TestHTTPGetInput", 
);
// TestHTTPGetInput entity
export interface TestHTTPGetInputProperties
 {
    // /**
    // * Returns "SpecularJS/TestPackage:TestHTTPGetInput"
    // */
    // fqtn: "SpecularJS/TestPackage:TestHTTPGetInput";
};
export interface TestHTTPGetInput extends TestHTTPGetInputProperties, Runtime.StructInterface{};
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
export interface TestHTTPGetOutputProperties
 {
    // /**
    // * Returns "SpecularJS/TestPackage:TestHTTPGetOutput"
    // */
    // fqtn: "SpecularJS/TestPackage:TestHTTPGetOutput";
    response : ResponseProperties| null;
};
export interface TestHTTPGetOutput extends TestHTTPGetOutputProperties, Runtime.StructInterface{};

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


// TestHTTPResource is the TestHTTPResource resource client
class TestHTTPResource {
    private readonly client: Runtime.Client;
    constructor(client: Runtime.Client) {
        this.client = client;
    }
    async Get(inputProps: TestHTTPGetInputProperties): Promise<TestHTTPGetOutputProperties> {
        const res = await this.client.execute(_testHTTPGetOperationMeta, inputProps);
        return res as TestHTTPGetOutputProperties;
    }
}
