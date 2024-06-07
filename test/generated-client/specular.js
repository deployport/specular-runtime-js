// JS gen package
import { Metadata, } from '../../lib/index.js';
const _pkg = new Metadata.Package('specularjs/testpackage');
export const BodyMeta = new Metadata.Struct(_pkg, "Body");
new Metadata.Property(BodyMeta, "contentLength", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "int32"
});
;
;
export const ResponseMeta = new Metadata.Struct(_pkg, "Response");
new Metadata.Property(ResponseMeta, "body", {
    NonNullable: false,
    SubType: "userDefined",
    Type: SpecularPackage().requireTypeByName("Body")
});
;
;
export const TestHTTPGetInputMeta = new Metadata.Struct(_pkg, "TestHTTPGetInput");
;
;
export const TestHTTPGetOutputMeta = new Metadata.Struct(_pkg, "TestHTTPGetOutput");
new Metadata.Property(TestHTTPGetOutputMeta, "response", {
    NonNullable: false,
    SubType: "userDefined",
    Type: SpecularPackage().requireTypeByName("Response")
});
;
;
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
    client;
    constructor(client) {
        this.client = client;
    }
    async Get(inputProps) {
        const res = await this.client.execute(_testHTTPGetOperationMeta, inputProps);
        return res;
    }
}
