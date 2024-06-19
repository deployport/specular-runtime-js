
/**
 * Parses a time string or returns the time parsing when necessary
 * @param maybeTime 
 * @returns 
 */
export function ParseTime(maybeTime: any): Date | null {
    if (maybeTime == null) {
        return null;
    }
    if (typeof maybeTime === 'string') {
        return new Date(maybeTime);
    }
    if (maybeTime instanceof Date) {
        return maybeTime;
    }
    return null;
}

/**
 * Parses a time string or throws an error
 * @param maybeTime 
 */
export function RequireParseTime(maybeTime: any): Date {
    const tm = ParseTime(maybeTime);
    if (tm == null) {
        throw new Error(`Cannot parse time from ${typeof maybeTime}(${maybeTime})`);
    }
    return tm;
}

/**
 * Parse a blob from a base64 string, or throw an error
 * @param maybeStringBase64 
 * @returns Blob instance
 */
export function ParseRequiredBinary(maybeStringBase64: any): Blob {
    const b = ParseOptionalBinary(maybeStringBase64);
    if (!b) {
        throw new Error(`Cannot parse blob from null or undefined`);
    }
    return b;
}

/**
 * Parses a blob from a base64 string, or returns null. Only returns an error if the value is not a string
 * @param maybeStringBase64 
 * @returns 
 */
export function ParseOptionalBinary(maybeStringBase64: any): Blob | null {
    if (typeof maybeStringBase64 !== 'string') {
        throw new Error(`Cannot parse blob from ${typeof maybeStringBase64}(${maybeStringBase64})`);
    }
    const bytes = atob(maybeStringBase64);
    const bytesLength = bytes.length;
    const bytesArray = new Uint8Array(bytesLength);
    for (let i = 0; i < bytesLength; i++) {
        bytesArray[i] = bytes.charCodeAt(i);
    }
    return new Blob([bytesArray]);
}

/**
 * Converts a blob to base64 string
 * @param blob 
 * @returns 
 */
export async function BlobToBase64(blob: Blob | null | undefined): Promise<string | null> {
    if (!blob) {
        return null;
    }
    const arrayBuffer = await blob.arrayBuffer();
    const base64String = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    return base64String;
}
