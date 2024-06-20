import { Runtime, Metadata } from '../../lib/index.js';
export declare const BodyTypeMeta: Metadata.Enum;
export declare enum BodyType {
    Normal = "normal",
    Special = "special"
}
export declare const BodyMeta: Metadata.Struct;
export interface BodyProperties {
    bodyType: BodyType;
    bodyTypeNullable: BodyType | null;
    contentLengthFloat32: number;
    contentLengthFloat64: number;
    contentLengthFloat64Nullable: number | null;
    contentLengthInt32: number;
    contentLengthInt64: number;
    contentLengthUint32: number;
    contentLengthUint64: number;
    contentLengthUint64Nullable: number;
    createdAt: Date;
    createdAtNullable: Date | null;
    fileData: Blob;
    fileDataNullable: Blob | null;
    messageString: string;
    messageStringNullable: string | null;
}
export interface Body extends BodyProperties, Runtime.StructInterface {
}
export declare const ResponseMeta: Metadata.Struct;
export interface ResponseProperties {
    body: BodyProperties | null;
}
export interface Response extends ResponseProperties, Runtime.StructInterface {
}
export declare const NotFoundProblemMeta: Metadata.Struct;
export interface NotFoundProblemProperties {
    detail: string;
    status: number;
    title: string;
    message: string;
}
export declare class NotFoundProblem extends Error implements NotFoundProblemProperties, Runtime.StructInterface {
    detail: string;
    status: number;
    title: string;
    message: string;
    get __structPath(): Metadata.StructPath;
}
export declare const TestHTTPGetInputMeta: Metadata.Struct;
export interface TestHTTPGetInputProperties {
}
export interface TestHTTPGetInput extends TestHTTPGetInputProperties, Runtime.StructInterface {
}
export declare const TestHTTPGetOutputMeta: Metadata.Struct;
export interface TestHTTPGetOutputProperties {
    response: ResponseProperties | null;
}
export interface TestHTTPGetOutput extends TestHTTPGetOutputProperties, Runtime.StructInterface {
}
export declare const TestHTTPOtherInputMeta: Metadata.Struct;
export interface TestHTTPOtherInputProperties {
}
export interface TestHTTPOtherInput extends TestHTTPOtherInputProperties, Runtime.StructInterface {
}
export declare const TestHTTPOtherOutputMeta: Metadata.Struct;
export interface TestHTTPOtherOutputProperties {
}
export interface TestHTTPOtherOutput extends TestHTTPOtherOutputProperties, Runtime.StructInterface {
}
export declare const TestHTTPWatchChangesInputMeta: Metadata.Struct;
export interface TestHTTPWatchChangesInputProperties {
}
export interface TestHTTPWatchChangesInput extends TestHTTPWatchChangesInputProperties, Runtime.StructInterface {
}
export declare const TestHTTPWatchChangesOutputMeta: Metadata.Struct;
export interface TestHTTPWatchChangesOutputProperties {
    response: ResponseProperties | null;
}
export interface TestHTTPWatchChangesOutput extends TestHTTPWatchChangesOutputProperties, Runtime.StructInterface {
}
export declare function SpecularPackage(): Metadata.Package;
declare class TestHTTPResource {
    private readonly client;
    constructor(client: Runtime.Client);
    Get(inputProps: TestHTTPGetInputProperties): Promise<TestHTTPGetOutput>;
    Other(inputProps: TestHTTPOtherInputProperties): Promise<TestHTTPOtherOutput>;
    WatchChanges(inputProps: TestHTTPWatchChangesInputProperties, outputCallback: (TestHTTPWatchChangesOutput: any) => Promise<void>): Promise<void>;
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
    readonly TestHTTP: TestHTTPResource;
    constructor(config?: Config);
}
export {};
