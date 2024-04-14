import { Runtime, Metadata } from '../../lib/index.js';
export declare const BodyMeta: Metadata.Struct;
export interface BodyProperties {
    contentLength: number;
}
export interface Body extends BodyProperties, Runtime.StructInterface {
}
export declare const ResponseMeta: Metadata.Struct;
export interface ResponseProperties {
    body: BodyProperties | null;
}
export interface Response extends ResponseProperties, Runtime.StructInterface {
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
export declare function SpecularPackage(): Metadata.Package;
