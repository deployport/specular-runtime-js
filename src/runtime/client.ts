import Operation from "../metadata/operation.js";
import Package from "../metadata/package.js";
import Content, { CreateContentFromObject, Properties } from "./content.js";
import { HTTPRequest, Part, StreamMultipartMixedChunks } from "./http.js";
import { GenericProperties, Struct, StructInterface } from "./struct.js";

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

async function parseHTTPResult(pkg: Package, contentType: string, parseBody: () => Promise<any>): Promise<httpResult> {
    if (contentType === "specular/struct") {
        const outputJSON = await parseBody() as Properties;
        const responseStruct = pkg.requireBuildFromJSON(outputJSON);
        if (responseStruct instanceof Error) {
            throw responseStruct;
        }
        return { struct: responseStruct };
    }
    if (contentType === "specular/error") {
        const err = await parseBody() as httpError;
        return { error: err };
    }
    if (contentType === "specular/heartbeat") {
        return { heartbeat: true };
    }
    throw new Error("not implemented " + contentType);
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
 * @param more is the configuration to add more to the original. For scalar properties it overrides the original. For array properties it appends to the original., for array properties it appends over the original.
 * @returns 
 */
export function MergeClientConfig(a?: ClientConfig, more?: ClientConfig): ClientConfig {
    const config = {
        ...a,
    }
    if (more?.endpoint) {
        config.endpoint = more.endpoint
    }
    if (more?.requestConfigurators) {
        config.requestConfigurators = [...(config.requestConfigurators || []), ...more.requestConfigurators]
    }
    return config;
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
        // console.log("Hello World from runtime/main.mjs v2 from native typescript");
    }

    private async configureRequest(sub: Submission) {
        for (const configurator of this.requestConfigurators) {
            await configurator(sub);
        }
    }

    async postOperation(operation: Operation, inputProps: GenericProperties, abortController: AbortController): Promise<Response> {
        // operation.resource.package.
        const uri = this.endpoint + "/" + operation.resource.packageUniqueName + "/" + operation.name;
        const content = await operation.input.serialize(inputProps);
        const body = JSON.stringify(content);
        // console.log("operation input body", body);

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
            // console.warn("error", result.error);
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
                // console.log("heartbeat received, ignoring");
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
        } catch (err) {
            throw err;
        } finally {
            // make sure we abort the request when done
            abortController.abort();
        }
    }
}

