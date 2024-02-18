import responseIterator from 'response-iterator';

export type Part = {
    headers: Record<string, string>;
    body: string;
}

/**
 * StreamCallback is a callback function that is called for each chunk of data
 * received from the server. The callback is called with a null chunk when the
 * stream is complete.
 */
type StreamCallback = (chunk: Part) => Promise<void>;

const delimiter = "boundary=";

const partHeaderBodySeparator = "\r\n\r\n";

export async function StreamMultipartMixedChunks(httpResponse: any, callback: StreamCallback) {
    const contentType = httpResponse.headers?.get("content-type");

    // parse boundary value and ignore any subsequent name/value pairs after ;
    // https://www.rfc-editor.org/rfc/rfc9110.html#name-parameters
    // e.g. multipart/mixed;boundary="graphql";deferSpec=20220824
    // if no boundary is specified, default to -
    const boundaryVal = contentType?.includes(delimiter)
        ? contentType
            ?.substring(contentType?.indexOf(delimiter) + delimiter.length)
            .replace(/['"]/g, "")
            .replace(/;(.*)/gm, "")
            .trim()
        : "-";
    const boundary = `\r\n--${boundaryVal}`;
    const iterator = responseIterator(httpResponse);
    let buffer = "";
    let running = true;

    const decoder = new TextDecoder("utf-8");

    while (running) {
        const { value, done } = await iterator.next();
        const chunk = typeof value === "string" ? value : decoder.decode(value);
        const searchFrom = buffer.length - boundary.length + 1;
        running = !done;
        buffer += chunk;
        let bi = buffer.indexOf(boundary, searchFrom);

        while (bi > -1) {
            let message: string;
            [message, buffer] = [
                buffer.slice(0, bi),
                buffer.slice(bi + boundary.length),
            ];
            const i = message.indexOf(partHeaderBodySeparator);
            const headers = parseHeaders(message.slice(0, i));
            const contentType = headers["content-type"];
            if (contentType === '') {
                continue;
            }
            // if (
            //     contentType &&
            //     contentType.toLowerCase().indexOf("application/json") === -1
            // ) {
            //     throw new Error(
            //         "unsupported operation content type: application/json is required."
            //     );
            // }
            // slice off the \r\n\r\n at the beginning of the body and the \n-- at the end
            const body = message.slice(i + partHeaderBodySeparator.length, message.length - 1);

            if (body) {
                const part: Part = {
                    headers,
                    body,
                };
                await callback(part);
            }
            bi = buffer.indexOf(boundary);
        }
    }
}

function parseHeaders(headerText: string): Record<string, string> {
    const headers: Record<string, string> = {};
    headerText.split("\n").forEach((line) => {
        const i = line.indexOf(":");
        if (i > -1) {
            const name = line.slice(0, i).trim().toLowerCase();
            const value = line.slice(i + 1).trim();
            headers[name] = value;
        }
    });
    return headers;
}

export type HTTPHeaders = Record<string, string | string[]>;

export class HTTPRequest {
    public method: string = '';
    public url: string = '';
    public headers: HTTPHeaders = {};
    public body: string = '';
    public abortController: AbortController | null = null;

    get path(): string {
        const url = new URL(this.url);
        return url.pathname + url.search;
    }

    async fetch(): Promise<Response> {
        const h: string[][] = [];
        for (const key in this.headers) {
            const val = this.headers[key];
            if (Array.isArray(val)) {
                for (const v of val) {
                    h.push([key, v]);
                }
            } else {
                h.push([key, val]);
            }
        }
        const hh = new Headers(h);
        const response = await fetch(this.url, {
            method: this.method,
            headers: hh,
            body: this.body,
            signal: this.abortController?.signal,
            credentials: "include",
        });
        return response;
    }
}
