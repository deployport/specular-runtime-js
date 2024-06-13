import Operation from "../metadata/operation.js";
import Package from "../metadata/package.js";
import { StructPath } from "../metadata/struct.js";
import { Properties } from "./content.js";
import { HTTPRequest, Part, StreamMultipartMixedChunks } from "./http.js";
import { GenericProperties } from "./struct.js";

interface httpError {
    readonly message: string
    resource: string
    operation: string
    // HTTPStatusCode int`json:"-"`
    code: string
}

function newHttpErrorException(err: httpError): Error {
    return new Error(err.message + " " + err.code);
}

interface httpResult {
    struct?: GenericProperties
    error?: httpError
    heartbeat?: boolean
}
const contentTypeFormat = "+json"

const cleanHTTPContentTypeFormat = (contentType: string): string => {
    const idx = contentType.indexOf(contentTypeFormat);
    if (idx === -1) {
        return contentType;
    }
    return contentType.substring(0, idx);
}

async function parseHTTPResult(pkg: Package, contentType: string, parseBody: () => Promise<any>): Promise<httpResult> {
    const outputJSON = await parseBody() as Properties;
    const mediaType = StructPath.fromString(cleanHTTPContentTypeFormat(contentType));
    const responseStruct = pkg.requireBuildFromJSON(mediaType, outputJSON);
    if (responseStruct instanceof Error) {
        throw responseStruct;
    }
    return { struct: responseStruct };
    // // TODO: handle other content types
    // if (contentType === "specular/error") {
    //     const err = await parseBody() as httpError;
    //     return { error: err };
    // }
    // if (contentType === "specular/heartbeat") {
    //     return { heartbeat: true };
    // }
    // throw new Error("not implemented " + contentType);
}

export type Submission = {
    operation: Operation
    request: HTTPRequest
}

/**
 * ClientConfig is the configuration of a client
 */
export type ClientConfig = {
    /**
     * The endpoint to connect to. This should be the base URL of the service. E.g("http://localhost:3000/svc1")
     */
    endpoint?: string

    requestConfigurators?: RequestConfigurationHook[]
}

/**
 * Returns a copy of original with any overrides applied. If overrides is null, the original is returned.
 * @param a is the original configuration
 * @param more is the configuration to add more to the original.
 * @returns 
 */
export function MergeClientConfig(a?: ClientConfig, more?: ClientConfig): ClientConfig {
    return {
        ...a,
        ...more,
    };
}

/**
 * Called before every request to allow the caller to configure the request
 */
export type RequestConfigurationHook = (sub: Submission) => Promise<void>;

export default class Client {
    private readonly endpoint: string;
    private readonly requestConfigurators: RequestConfigurationHook[] = [];

    constructor(config: ClientConfig) {
        if (!config.endpoint) {
            throw new Error("endpoint is required");
        }
        this.endpoint = config.endpoint;
        if (config.requestConfigurators) {
            this.requestConfigurators.push(...config.requestConfigurators);
        }
    }

    private async configureRequest(sub: Submission) {
        for (const configurator of this.requestConfigurators) {
            await configurator(sub);
        }
    }

    async postOperation(operation: Operation, inputProps: GenericProperties, abortController: AbortController): Promise<Response> {
        const uri = this.endpoint + "/" + operation.resource.packageUniqueName + "/" + operation.name;
        const content = await operation.input.serialize(inputProps);
        const body = JSON.stringify(content);

        const req = new HTTPRequest();
        req.method = "POST";
        req.url = uri;
        req.headers["Content-Type"] = "application/json";
        req.body = body;
        req.abortController = abortController;
        await this.configureRequest({
            operation,
            request: req,
        });

        const res = await req.fetch();
        // if (res.status != 200) {
        //     throw new Error(`failed to stream operation ${res.status} ${res.statusText}`);
        // }
        return res;
    }

    /**
     * Executes an operation and returns its single result
     * @param operation 
     * @param input 
     * @returns the output struct of the operation
     */
    async execute(operation: Operation, inputProps: GenericProperties): Promise<GenericProperties> {
        const res = await this.postOperation(operation, inputProps, new AbortController());
        // check if content type is specular/struct
        const contentType = res.headers.get("Content-Type");
        if (!contentType) {
            throw new Error("invalid response, missing content type");
        }
        const result = await parseHTTPResult(operation.resource.package, contentType, async () => await res.json());

        if (result.struct) {
            return result.struct;
        }
        if (result.error) {
            throw newHttpErrorException(result.error);
        }
        if (result.heartbeat) {
            throw new Error("unexpected heartbeat");
        }
        throw new Error("unexpected result");
    }

    /**
     * Execute an operation and stream the results to the provided awaited callback.
     * The returned promise resolves when the stream is complete.
     * @param operation 
     * @param input 
     * @param outputCallback returns a promise that resolves when the given output has been processed and the next output can be streamed
     * @throws Error if the operation fails or the stream fails. The stream will be aborted if the callback throws an error which is the recommended way to stop the stream.
     */
    async stream(operation: Operation, input: GenericProperties, outputCallback: (struct: GenericProperties) => Promise<void>) {
        const abortController = new AbortController();
        const res = await this.postOperation(operation, input, abortController);
        const partCallback = async (chunk: Part): Promise<void> => {
            const result = await parseHTTPResult(operation.resource.package, chunk.headers['content-type'], async () => JSON.parse(chunk.body));
            if (result.heartbeat) {
                return;
            }
            if (result.error) {
                throw newHttpErrorException(result.error);
            }
            if (result.struct) {
                await outputCallback(result.struct);
                return;
            }
            // const outputJSON = JSON.parse(chunk.body) as Properties;
            // const responseStruct = operation.resource.package.requireBuildFromJSON(outputJSON);
            // if (responseStruct instanceof Error) {
            //     throw responseStruct;
            // }
            throw new Error("unexpected result");
        };
        try {
            await StreamMultipartMixedChunks(res, partCallback);
        } finally {
            // make sure we abort the request when done
            abortController.abort();
        }
    }
}

