import { Runtime, Metadata } from '@deployport/specular-runtime';
/** Enum metadata
*/
export declare const BodyTypeMeta: Metadata.Enum;
/** enum BodyType
*/
export declare enum BodyType {
    /** enum constant Normal
*/
    Normal = "normal",
    /** enum constant Special
*/
    Special = "special"
}
/** Struct metadata
*/
export declare const BodyMeta: Metadata.Struct;
/** struct Body
*/
export interface BodyProperties {
    /** bodyType property
*/
    bodyType: BodyType;
    /** bodyTypeNullable property
*/
    bodyTypeNullable: BodyType | null;
    /** contentLengthFloat32 property
*/
    contentLengthFloat32: number;
    /** contentLengthFloat64 property
*/
    contentLengthFloat64: number;
    /** contentLengthFloat64Nullable property
*/
    contentLengthFloat64Nullable: number | null;
    /** contentLengthInt32 property
*/
    contentLengthInt32: number;
    /** contentLengthInt64 property
*/
    contentLengthInt64: number;
    /** contentLengthUint32 property
*/
    contentLengthUint32: number;
    /** contentLengthUint64 property
*/
    contentLengthUint64: number;
    /** contentLengthUint64Nullable property
*/
    contentLengthUint64Nullable: number;
    /** createdAt property
*/
    createdAt: Date;
    /** createdAtNullable property
*/
    createdAtNullable: Date | null;
    /** fileData property
*/
    fileData: Blob;
    /** fileDataNullable property
*/
    fileDataNullable: Blob | null;
    /** messageString property
*/
    messageString: string;
    /** messageStringNullable property
*/
    messageStringNullable: string | null;
}
/** struct Body
*/
export interface Body extends BodyProperties, Runtime.StructInterface {
}
/** Struct metadata
*/
export declare const ResponseMeta: Metadata.Struct;
/** struct Response
*/
export interface ResponseProperties {
    /** body property
*/
    body: BodyProperties | null;
}
/** struct Response
*/
export interface Response extends ResponseProperties, Runtime.StructInterface {
}
/** Struct metadata
*/
export declare const NotFoundProblemMeta: Metadata.Struct;
/** struct NotFoundProblem
*/
export interface NotFoundProblemProperties {
    /** detail property
*/
    detail: string;
    /** message property
*/
    message: string;
    /** status property
*/
    status: number;
    /** title property
*/
    title: string;
}
/** struct NotFoundProblem
*/
export declare class NotFoundProblem extends Runtime.RpcError implements NotFoundProblemProperties, Runtime.StructInterface {
    detail: string;
    status: number;
    title: string;
    get __structPath(): Metadata.StructPath;
}
/** Struct metadata
*/
export declare const TestHTTPGetInputMeta: Metadata.Struct;
/** struct TestHTTPGetInput
*/
export interface TestHTTPGetInputProperties {
}
/** struct TestHTTPGetInput
*/
export interface TestHTTPGetInput extends TestHTTPGetInputProperties, Runtime.StructInterface {
}
/** Struct metadata
*/
export declare const TestHTTPGetOutputMeta: Metadata.Struct;
/** struct TestHTTPGetOutput
*/
export interface TestHTTPGetOutputProperties {
    /** response property
*/
    response: ResponseProperties | null;
}
/** struct TestHTTPGetOutput
*/
export interface TestHTTPGetOutput extends TestHTTPGetOutputProperties, Runtime.StructInterface {
}
/** Struct metadata
*/
export declare const TestHTTPOtherInputMeta: Metadata.Struct;
/** struct TestHTTPOtherInput
*/
export interface TestHTTPOtherInputProperties {
}
/** struct TestHTTPOtherInput
*/
export interface TestHTTPOtherInput extends TestHTTPOtherInputProperties, Runtime.StructInterface {
}
/** Struct metadata
*/
export declare const TestHTTPOtherOutputMeta: Metadata.Struct;
/** struct TestHTTPOtherOutput
*/
export interface TestHTTPOtherOutputProperties {
}
/** struct TestHTTPOtherOutput
*/
export interface TestHTTPOtherOutput extends TestHTTPOtherOutputProperties, Runtime.StructInterface {
}
/** Struct metadata
*/
export declare const TestHTTPWatchChangesInputMeta: Metadata.Struct;
/** struct TestHTTPWatchChangesInput
*/
export interface TestHTTPWatchChangesInputProperties {
}
/** struct TestHTTPWatchChangesInput
*/
export interface TestHTTPWatchChangesInput extends TestHTTPWatchChangesInputProperties, Runtime.StructInterface {
}
/** Struct metadata
*/
export declare const TestHTTPWatchChangesOutputMeta: Metadata.Struct;
/** struct TestHTTPWatchChangesOutput
*/
export interface TestHTTPWatchChangesOutputProperties {
    /** response property
*/
    response: ResponseProperties | null;
}
/** struct TestHTTPWatchChangesOutput
*/
export interface TestHTTPWatchChangesOutput extends TestHTTPWatchChangesOutputProperties, Runtime.StructInterface {
}
export declare function SpecularPackage(): Metadata.Package;
declare class TestHTTPResourceClient {
    private readonly client;
    constructor(client: Runtime.Client);
    /** operation Get
*/
    Get(inputProps: TestHTTPGetInputProperties): Promise<TestHTTPGetOutput>;
    /** operation Other
*/
    Other(inputProps: TestHTTPOtherInputProperties): Promise<TestHTTPOtherOutput>;
    /** operation WatchChanges
*/
    WatchChanges(inputProps: TestHTTPWatchChangesInputProperties, outputCallback: (output: TestHTTPWatchChangesOutput) => Promise<void>): Promise<void>;
}
export declare function defaultRuntimeConfig(): Runtime.ClientConfig;
export declare function createRuntimeClientConfig(config?: Partial<Runtime.ClientConfig>): Runtime.ClientConfig;
export declare function createRuntimeClient(config?: Partial<Runtime.ClientConfig>): Runtime.Client;
export type ClientConfig = {
    client?: Runtime.Client;
};
export type Config = ClientConfig & Runtime.ClientConfig;
/**
 * @class Client class for package testpackage
 */
export declare class Client {
    private readonly client;
    /** resource TestHTTP client
*/
    readonly TestHTTP: TestHTTPResourceClient;
    constructor(config?: Config);
}
export {};
