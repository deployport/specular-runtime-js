/**
 * RpcError is the base class for every error surfaced from a specular call:
 * built-in protocol errors, user-defined errors, and the generic
 * {@link UnknownRpcError} produced when the client cannot resolve the error
 * type.
 */
export class RpcError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "RpcError";
    }
}

/**
 * UnknownRpcError is thrown when the server returns an error whose type the
 * client was not generated with knowledge of (for example a newer server
 * introduced an error type after the client was generated).
 *
 * It is still a catchable {@link RpcError} while exposing the raw payload so
 * forward-compatible code can read the fields it knows.
 */
export class UnknownRpcError extends RpcError {
    /** Fully-qualified type name (e.g. application/spec.ns.mod.type) advertised by the server. */
    readonly typeName: string;
    /** Machine-readable code, when discoverable in the payload. */
    readonly code?: string;
    /** Raw, undecoded error payload. */
    readonly payload: unknown;

    constructor(typeName: string, payload: unknown) {
        const props = (payload && typeof payload === "object")
            ? payload as Record<string, unknown>
            : {};
        const message = typeof props["message"] === "string"
            ? props["message"] as string
            : `unknown rpc error ${typeName}`;
        super(message);
        this.name = "UnknownRpcError";
        this.typeName = typeName;
        this.code = typeof props["code"] === "string" ? props["code"] as string : undefined;
        this.payload = payload;
    }
}
