import test from 'tape';
import { SpecularPackage, ResponseMeta, BodyMeta, BodyType, NotFoundProblem, NotFoundProblemMeta } from './generated-client/specular.js';
import {
    Metadata,
} from '../lib/index.js';
import { StructPath } from '../lib/metadata/struct.js';
import { defaultZeroTime } from '../lib/metadata/builtin.js';
import { BlobToBase64, ParseOptionalBinary } from '../lib/runtime/builtin.js';
import { parseHTTPResult } from '../lib/runtime/client.js';
import { RpcError, UnknownRpcError } from '../lib/runtime/error.js';
import { TypeNotFoundError } from '../lib/metadata/package.js';

const _pkg = SpecularPackage();

test('StructPath', (t) => {
    const sp = StructPath.fromString('application/spec.myns.mymod.mytype');
    t.equal(sp.name, "mytype");
    t.equal(sp.module.namespace, "myns");
    t.equal(sp.module.name, "mymod");
    t.end();
});

test('Deserialize with builtins props', (t) => {
    t.test("missing", (t) => {
        const obj = {
            "body": {}
        };
        const s = _pkg.requireBuildFromJSON(ResponseMeta.path, obj);
        t.notEqual(s.body, null);
        t.equal(s.body.contentLengthInt32, 0);
        t.equal(s.body.contentLengthInt64, 0);
        t.equal(s.body.contentLengthFloat32, 0);
        t.equal(s.body.contentLengthFloat64, 0);
        t.equal(s.body.contentLengthFloat64Nullable, null);
        t.equal(s.body.contentLengthUint32, 0);
        t.equal(s.body.contentLengthUint64, 0);
        t.equal(s.body.messageString, "");
        t.equal(s.body.messageStringNullable, null);
        t.equal(s.body.enabledBool, false, "default bool value when missing");
        t.equal(s.body.enabledBoolNullable, null);
        t.deepEqual(s.body.createdAt, defaultZeroTime());
        t.deepEqual(s.body.createdAtNullable, null);
        t.notEqual(s.body.fileData, null);
        t.equal(typeof s.body.fileData, 'object');
        t.equal(s.body.fileData.constructor, Blob);
        t.equal(s.body.fileDataNullable, null);
        t.equal(s.body.bodyType, BodyType.Normal, "default enum value when missing");
        t.equal(s.body.bodyTypeNullable, null);
        t.deepEqual(s.body.tags, [], "default list value when missing");
        t.equal(s.body.tagsNullable, null);
        t.end();
    });
    t.test("value", (t) => {
        const obj = {
            "body": {
                "contentLengthInt32": 32,
                "contentLengthFloat64Nullable": 64,
                "messageString": "msg",
                "messageStringNullable": "msg nullable",
                "enabledBool": true,
                "enabledBoolNullable": true,
                "createdAtNullable": "2024-06-18T02:02:07.602Z",
                "fileData": "",
                "bodyType": "special",
                "bodyTypeNullable": "special"
            }
        };
        const s = _pkg.requireBuildFromJSON(ResponseMeta.path, obj);
        t.notEqual(s.body, null);
        t.equal(s.body.contentLengthInt32, 32);
        t.equal(s.body.contentLengthFloat64Nullable, 64);
        t.equal(s.body.messageString, "msg");
        t.equal(s.body.messageStringNullable, "msg nullable");
        t.equal(s.body.enabledBool, true);
        t.equal(s.body.enabledBoolNullable, true);
        t.same(s.body.createdAtNullable, new Date('2024-06-18T02:02:07.602Z'));
        t.same(s.body.fileData, new Blob([]));
        t.equal(s.body.bodyType, BodyType.Special);
        t.equal(s.body.bodyTypeNullable, BodyType.Special);
        t.end();
    });
    t.test("value binary", async (t) => {
        const obj = {
            "body": {
                "fileData": await BlobToBase64(new Blob(['hi'], { type: "text/plain" })),
            }
        };
        const s = _pkg.requireBuildFromJSON(ResponseMeta.path, obj);
        t.notEqual(s.body, null);
        t.notEqual(s.body.fileData, null);
        t.true(areArrayBuffersEqual(await s.body.fileData.arrayBuffer(), await new Blob(['hi'], { type: "text/plain" }).arrayBuffer()));
        t.end();
    });
    t.test("nullable binary null", async (t) => {
        const obj = {
            "body": {
                "fileDataNullable": null,
            }
        };
        const s = _pkg.requireBuildFromJSON(ResponseMeta.path, obj);
        t.notEqual(s.body, null);
        t.equal(s.body.fileDataNullable, null);
        t.end();
    });
    t.test("nullable binary value", async (t) => {
        const obj = {
            "body": {
                "fileDataNullable": await BlobToBase64(new Blob(['hi'], { type: "text/plain" })),
            }
        };
        const s = _pkg.requireBuildFromJSON(ResponseMeta.path, obj);
        t.notEqual(s.body, null);
        t.notEqual(s.body.fileDataNullable, null);
        t.true(areArrayBuffersEqual(await s.body.fileDataNullable.arrayBuffer(), await new Blob(['hi'], { type: "text/plain" }).arrayBuffer()));
        t.end();
    });
});

function areArrayBuffersEqual(buffer1, buffer2) {
    if (buffer1.byteLength !== buffer2.byteLength) return false;

    const view1 = new Uint8Array(buffer1);
    const view2 = new Uint8Array(buffer2);

    for (let i = 0; i < view1.length; i++) {
        if (view1[i] !== view2[i]) return false;
    }

    return true;
}

// An absent `[T!]!` used to come back null, so every `for...of` threw. It took down a page in
// the console on 2026-08-10. The generated type says non-optional array, so no typecheck can
// see it; only real data can.
test('An absent non-nullable list is restored to an empty array, not null', (t) => {
    const s = _pkg.requireBuildFromJSON(ResponseMeta.path, { "body": {} });
    t.deepEqual(s.body.tags, [], "[T!]! absent must be []");
    t.doesNotThrow(() => { for (const _ of s.body.tags) { /* the crash */ } },
        "an absent non-nullable list must be iterable");
    t.equal(s.body.tagsNullable, null, "[T!] absent stays null, because absence means something there");
    t.deepEqual(
        _pkg.requireBuildFromJSON(ResponseMeta.path, { "body": { "tags": ["a", "b"] } }).body.tags,
        ["a", "b"],
        "a populated list is untouched");
    t.deepEqual(
        _pkg.requireBuildFromJSON(ResponseMeta.path, { "body": { "tags": [] } }).body.tags,
        [],
        "an explicitly empty list is untouched");
    t.end();
});

test('Deserialize with struct props', (t) => {
    t.test("null field", (t) => {
        const obj = {
            "body": null
        };
        const s = _pkg.requireBuildFromJSON(ResponseMeta.path, obj);
        t.equal(s.body, null);
        t.end();
    });
    t.test("missing field", (t) => {
        const obj = {};
        const s = _pkg.requireBuildFromJSON(ResponseMeta.path, obj);
        console.log("s", s)
        t.equal(s.body, null);
        t.end();
    });
});

test('Serialize with struct props', (t) => {
    t.test("missing", async (t) => {
        const obj = await ResponseMeta.serialize({})
        t.deepEqual(Object.keys(obj), [])
        t.end()
    });
    t.test("struct prop null", async (t) => {
        const obj = await ResponseMeta.serialize({
            body: null
        })
        t.deepEqual(Object.keys(obj), [])
        t.end()
    });
    t.test("struct prop empty", async (t) => {
        const obj = await ResponseMeta.serialize({
            body: {}
        })
        t.false(Object.keys(obj).indexOf('body'), -1)
        t.end()
    });
});

test('Serialize with builtin props', (t) => {
    t.test("missing", async (t) => {
        const obj = await BodyMeta.serialize({})
        t.deepEqual(Object.keys(obj), [])
        t.end()
    });
    // Must be its own case: "missing" above leaves the property undefined, so an earlier guard
    // absorbs it and the length check never runs. Without this, the omission is untested.
    t.test("explicitly empty non-nullable list is omitted", async (t) => {
        const obj = await BodyMeta.serialize({ tags: [] })
        t.deepEqual(Object.keys(obj), [], "an empty [T!]! is the zero value, so it is waste on the wire")
        t.end()
    });
    t.test("explicitly empty NULLABLE list is kept", async (t) => {
        const obj = await BodyMeta.serialize({ tagsNullable: [] })
        t.deepEqual(obj.tagsNullable, [], "for [T!] an empty list is distinguishable from absent, so it survives")
        t.end()
    });
    t.test("custom value", async (t) => {
        const obj = await BodyMeta.serialize({
            contentLengthInt32: 32,
            contentLengthUint64Nullable: 64,
            messageString: 'msg',
            enabledBool: true,
        })
        const props = Object.keys(obj);
        t.true(props.includes('contentLengthInt32'))
        t.false(props.includes('contentLengthFloat64Nullable'), 'should not include default nullable null')
        t.equal(obj.contentLengthInt32, 32);
        t.equal(obj.contentLengthUint64Nullable, 64);
        t.equal(obj.messageString, 'msg');
        t.true(props.includes('enabledBool'))
        t.equal(obj.enabledBool, true);
        t.end()
    });
    t.test("bool false is omitted", async (t) => {
        const obj = await BodyMeta.serialize({
            enabledBool: false,
            enabledBoolNullable: false,
        })
        const props = Object.keys(obj);
        t.false(props.includes('enabledBool'), 'false should be omitted (zero value)')
        t.true(props.includes('enabledBoolNullable'), 'nullable false must be sent, null is its default')
        t.equal(obj.enabledBoolNullable, false)
        t.end()
    });
    t.test("nulls", async (t) => {
        const obj = await BodyMeta.serialize({
            messageStringNullable: null,
            contentLengthFloat64Nullable: null,
            fileDataNullable: null,
            bodyTypeNullable: null,
        })
        const props = Object.keys(obj);
        t.false(props.includes('messageStringNullable'))
        t.false(props.includes('contentLengthFloat64Nullable'), 'should not include default nullable null')
        t.false(props.includes('fileDataNullable'), 'should not include default nullable null')
        t.false(props.includes('bodyTypeNullable'), 'should not include default nullable null')
        t.end()
    });
    t.test("nullable set", async (t) => {
        const obj = await BodyMeta.serialize({
            messageStringNullable: 'val',
            bodyTypeNullable: 'special',
        })
        const props = Object.keys(obj);
        t.true(props.includes('messageStringNullable'))
        t.equal(obj.messageStringNullable, 'val')
        t.equal(obj.bodyTypeNullable, 'special')
        t.end()
    });
    t.test("time default", async (t) => {
        const obj = await BodyMeta.serialize({
            createdAt: defaultZeroTime(),
        })
        const props = Object.keys(obj);
        t.false(props.includes('createdAt'), 'should not include date since is default date zero value')
        t.deepEqual(props, []);
        t.end()
    });
    t.test("time custom", async (t) => {
        const obj = await BodyMeta.serialize({
            createdAt: new Date(Date.UTC(2024, 1, 1)),
        })
        const props = Object.keys(obj);
        t.true(props.includes('createdAt'))
        t.deepEqual(props, ['createdAt']);
        t.equal(obj.createdAt, '2024-02-01T00:00:00.000Z');
        t.end()
    });
    t.test("binary default", async (t) => {
        const obj = await BodyMeta.serialize({
            fileData: new Blob([''], { type: "text/plain" }),
        })
        const props = Object.keys(obj);
        t.false(props.includes('fileData'), 'should not include date since is default binary is an empty string')
        t.deepEqual(props, []);
        t.end()
    });
    t.test("binary value", async (t) => {
        const obj = await BodyMeta.serialize({
            fileData: new Blob(['hi'], { type: "text/plain" }),
            fileDataNullable: new Blob(['hi'], { type: "text/plain" }),
        })
        const props = Object.keys(obj);
        t.true(props.includes('fileData'))
        t.equal(obj.fileData, 'aGk=');
        t.equal(obj.fileDataNullable, 'aGk=');
        t.end()
    });
    t.test("enum default", async (t) => {
        const obj = await BodyMeta.serialize({
            bodyType: BodyType.Normal,
        })
        const props = Object.keys(obj);
        t.false(props.includes('bodyType'), 'should not include since default value was set')
        t.deepEqual(props, []);
        t.end()
    });
});

// A property's default value follows the Specular spec:
//   non-nullable scalar -> default is the zero value, so omitting zero is lossless
//   nullable scalar     -> default is null, so omitting zero is LOSSY and zero must be sent
// Every assertion below is a round trip: serialize, then deserialize the same payload back.
test('Zero values are omitted only when the default is the zero value', (t) => {
    const roundTrip = async (props) => {
        const wire = await BodyMeta.serialize(props);
        // JSON.parse(JSON.stringify()) so we assert on what actually crosses the wire.
        return {
            wire,
            back: _pkg.requireBuildFromJSON(BodyMeta.path, JSON.parse(JSON.stringify(wire))),
        };
    };

    t.test("non-nullable zero is omitted and restored as the zero value", async (t) => {
        const { wire, back } = await roundTrip({
            contentLengthInt32: 0,
            contentLengthInt64: 0,
            contentLengthFloat64: 0,
            contentLengthUint32: 0,
            contentLengthUint64: 0,
            messageString: '',
            enabledBool: false,
            createdAt: defaultZeroTime(),
        });
        t.deepEqual(Object.keys(wire), [], 'non-nullable zeros carry no information, omit them all');
        t.equal(back.contentLengthInt32, 0);
        t.equal(back.contentLengthInt64, 0);
        t.equal(back.contentLengthFloat64, 0);
        t.equal(back.contentLengthUint32, 0);
        t.equal(back.contentLengthUint64, 0);
        t.equal(back.messageString, '');
        t.equal(back.enabledBool, false);
        t.deepEqual(back.createdAt, defaultZeroTime());
        t.end();
    });

    t.test("nullable zero is sent explicitly and read back as zero", async (t) => {
        const { wire, back } = await roundTrip({
            contentLengthUint64Nullable: 0,
            contentLengthFloat64Nullable: 0,
            messageStringNullable: '',
            enabledBoolNullable: false,
            createdAtNullable: defaultZeroTime(),
        });
        t.true(Object.hasOwn(wire, 'contentLengthUint64Nullable'), 'nullable int at zero must be on the wire');
        t.equal(wire.contentLengthUint64Nullable, 0);
        t.true(Object.hasOwn(wire, 'contentLengthFloat64Nullable'), 'nullable float at zero must be on the wire');
        t.equal(wire.contentLengthFloat64Nullable, 0);
        t.true(Object.hasOwn(wire, 'messageStringNullable'), 'nullable empty string must be on the wire');
        t.equal(wire.messageStringNullable, '');
        t.true(Object.hasOwn(wire, 'enabledBoolNullable'), 'nullable false must be on the wire');
        t.equal(wire.enabledBoolNullable, false);
        t.true(Object.hasOwn(wire, 'createdAtNullable'), 'nullable zero time must be on the wire');

        t.equal(back.contentLengthUint64Nullable, 0, 'nullable int survives the round trip as 0, not null');
        t.equal(back.contentLengthFloat64Nullable, 0);
        t.equal(back.messageStringNullable, '');
        t.equal(back.enabledBoolNullable, false);
        t.deepEqual(back.createdAtNullable, defaultZeroTime());
        t.end();
    });

    t.test("nullable null is omitted and restored as null", async (t) => {
        const { wire, back } = await roundTrip({
            contentLengthUint64Nullable: null,
            contentLengthFloat64Nullable: null,
            messageStringNullable: null,
            enabledBoolNullable: null,
            createdAtNullable: null,
            fileDataNullable: null,
            bodyTypeNullable: null,
        });
        t.deepEqual(Object.keys(wire), [], 'null is the default of a nullable field, so omit it');
        t.equal(back.contentLengthUint64Nullable, null);
        t.equal(back.contentLengthFloat64Nullable, null);
        t.equal(back.messageStringNullable, null);
        t.equal(back.enabledBoolNullable, null);
        t.equal(back.createdAtNullable, null);
        t.equal(back.fileDataNullable, null);
        t.equal(back.bodyTypeNullable, null);
        t.end();
    });

    t.test("nullable enum at its default constant is sent explicitly", async (t) => {
        const wire = await BodyMeta.serialize({
            bodyType: BodyType.Normal,
            bodyTypeNullable: BodyType.Normal,
        });
        t.false(Object.hasOwn(wire, 'bodyType'), 'non-nullable enum defaults to the first constant, omit it');
        t.true(Object.hasOwn(wire, 'bodyTypeNullable'), 'nullable enum defaults to null, so the constant must be sent');
        t.equal(wire.bodyTypeNullable, BodyType.Normal);
        const back = _pkg.requireBuildFromJSON(BodyMeta.path, JSON.parse(JSON.stringify(wire)));
        t.equal(back.bodyType, BodyType.Normal);
        t.equal(back.bodyTypeNullable, BodyType.Normal, 'nullable enum survives as its constant, not null');
        t.end();
    });

    t.test("nullable empty binary is sent explicitly", async (t) => {
        const wire = await BodyMeta.serialize({
            fileData: new Blob([]),
            fileDataNullable: new Blob([]),
        });
        t.false(Object.hasOwn(wire, 'fileData'), 'non-nullable binary defaults to empty, omit it');
        t.true(Object.hasOwn(wire, 'fileDataNullable'), 'nullable empty binary must be on the wire');
        t.equal(wire.fileDataNullable, '');
        const back = _pkg.requireBuildFromJSON(BodyMeta.path, JSON.parse(JSON.stringify(wire)));
        t.notEqual(back.fileDataNullable, null, 'nullable empty binary survives as an empty Blob, not null');
        t.equal(back.fileDataNullable.size, 0);
        t.end();
    });
});

const importingPkg = new Metadata.Package(
    'specularJS', 'importing',
);
importingPkg.importPackage(_pkg);

export const ImportingDoc = new Metadata.Struct(
    importingPkg,
    "Doc",
);

test('imported instantiation', (t) => {
    const obj = {
        "body": null
    };
    const s = importingPkg.requireBuildFromJSON(ResponseMeta.path, obj);
    t.equal(s.body, null);
    t.end();
});

test('unmatched case instantiation', (t) => {
    const obj = {
        "body": null
    };
    const sp = StructPath.fromString(ResponseMeta.path.mediaType.toUpperCase());
    const s = _pkg.requireBuildFromJSON(sp, obj);
    t.equal(s.body, null);
    t.end();
});

test('unknown error type degrades to UnknownRpcError', async (t) => {
    const ct = 'application/spec.myns.mymod.futureproblem+json; kind=error';
    try {
        await parseHTTPResult(_pkg, ct, async () => ({ message: 'quota exceeded', code: 'QUOTA', limit: 100 }));
        t.fail('expected parseHTTPResult to throw');
    } catch (e) {
        t.ok(e instanceof UnknownRpcError, 'is UnknownRpcError');
        t.ok(e instanceof RpcError, 'is RpcError');
        t.ok(e instanceof Error, 'is Error');
        t.equal(e.message, 'quota exceeded');
        t.equal(e.code, 'QUOTA');
        t.equal(e.typeName, 'application/spec.myns.mymod.futureproblem');
        t.deepEqual(e.payload, { message: 'quota exceeded', code: 'QUOTA', limit: 100 });
    }
    t.end();
});

test('deserialized struct preserves its prototype (buildByFQTN does not flatten)', (t) => {
    const r = _pkg.requireBuildFromJSON(NotFoundProblemMeta.path, { message: 'boom', status: 1 });
    t.ok(r instanceof NotFoundProblem, 'instance keeps its NotFoundProblem prototype');
    t.ok(r instanceof Error, 'instance is a real Error');
    t.equal(r.message, 'boom', 'message preserved');
    t.equal(r.status, 1);
    t.equal(r.__structPath, NotFoundProblemMeta.path, '__structPath preserved');
    t.end();
});

test('user-defined error is thrown (not returned) as a real Error', async (t) => {
    const ct = NotFoundProblemMeta.path.mediaType + '+json; kind=error';
    try {
        await parseHTTPResult(_pkg, ct, async () => ({ message: 'not found', detail: 'x', status: 404, title: 'NF' }));
        t.fail('expected parseHTTPResult to throw the user-defined error');
    } catch (e) {
        t.ok(e instanceof Error, 'thrown value is a real Error');
        t.ok(e instanceof NotFoundProblem, 'thrown value is a NotFoundProblem instance');
        t.equal(e.message, 'not found', 'message preserved');
        t.equal(e.detail, 'x');
        t.equal(e.status, 404);
    }
    t.end();
});

test('unknown type without kind=error stays a TypeNotFoundError', async (t) => {
    const ct = 'application/spec.myns.mymod.futureoutput+json';
    try {
        await parseHTTPResult(_pkg, ct, async () => ({ id: '1' }));
        t.fail('expected parseHTTPResult to throw');
    } catch (e) {
        t.notOk(e instanceof UnknownRpcError, 'not UnknownRpcError');
        t.ok(e instanceof TypeNotFoundError, 'is TypeNotFoundError');
    }
    t.end();
});

// BlobToBase64 used to spread every byte into one String.fromCharCode call, and V8 threw
// RangeError past about 125,000 bytes. A 2 MiB console screenshot hit it. The sizes sit on
// both sides of the 0x8000 chunk and past the old limit. Node's Buffer is the independent base64.
const BINARY_SIZES = [0, 1, 2, 3, 0x8000 - 1, 0x8000, 0x8000 + 1, 200000, 2 * 1024 * 1024];

function patternedBytes(n) {
    const bytes = new Uint8Array(n);
    let x = 0x9e3779b9;
    for (let i = 0; i < n; i++) {
        x = (Math.imul(x, 1103515245) + 12345) >>> 0;
        bytes[i] = x >>> 24;
    }
    return bytes;
}

test('BlobToBase64 round trips binary of every size through ParseOptionalBinary', (t) => {
    for (const n of BINARY_SIZES) {
        t.test(`${n} bytes`, async (t) => {
            const bytes = patternedBytes(n);
            let encoded;
            try {
                encoded = await BlobToBase64(new Blob([bytes]));
            } catch (e) {
                t.fail(`BlobToBase64 threw ${e}`);
                t.end();
                return;
            }
            t.equal(encoded, Buffer.from(bytes).toString('base64'), 'matches Buffer base64');
            const decoded = new Uint8Array(await ParseOptionalBinary(encoded).arrayBuffer());
            t.equal(decoded.length, n, 'decoded length');
            t.true(Buffer.from(decoded).equals(Buffer.from(bytes)), 'decoded bytes equal the input');
            t.end();
        });
    }
});

test('BlobToBase64 answers null for null and undefined', async (t) => {
    t.equal(await BlobToBase64(null), null);
    t.equal(await BlobToBase64(undefined), null);
    t.end();
});

// The real caller: a struct's binary field, which is how the console sends a screenshot.
test('A 2 MiB binary field serializes through its struct', async (t) => {
    const bytes = patternedBytes(2 * 1024 * 1024);
    const obj = await BodyMeta.serialize({ fileData: new Blob([bytes]) });
    t.equal(obj.fileData, Buffer.from(bytes).toString('base64'));
    t.end();
});