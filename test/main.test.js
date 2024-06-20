import test from 'tape';
import { SpecularPackage, ResponseMeta, BodyMeta, BodyType } from './generated-client/specular.js';
import {
    Metadata,
} from '../lib/index.js';
import { StructPath } from '../lib/metadata/struct.js';
import { defaultZeroTime } from '../lib/metadata/builtin.js';
import { BlobToBase64 } from '../lib/runtime/builtin.js';

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
        t.deepEqual(s.body.createdAt, defaultZeroTime());
        t.deepEqual(s.body.createdAtNullable, null);
        t.notEqual(s.body.fileData, null);
        t.equal(typeof s.body.fileData, 'object');
        t.equal(s.body.fileData.constructor, Blob);
        t.equal(s.body.fileDataNullable, null);
        t.equal(s.body.bodyType, BodyType.Normal, "default enum value when missing");
        t.equal(s.body.bodyTypeNullable, null);
        t.end();
    });
    t.test("value", (t) => {
        const obj = {
            "body": {
                "contentLengthInt32": 32,
                "contentLengthFloat64Nullable": 64,
                "messageString": "msg",
                "messageStringNullable": "msg nullable",
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
    t.test("custom value", async (t) => {
        const obj = await BodyMeta.serialize({
            contentLengthInt32: 32,
            contentLengthUint64Nullable: 64,
            messageString: 'msg',
        })
        const props = Object.keys(obj);
        t.true(props.includes('contentLengthInt32'))
        t.false(props.includes('contentLengthFloat64Nullable'), 'should not include default nullable null')
        t.equal(obj.contentLengthInt32, 32);
        t.equal(obj.contentLengthUint64Nullable, 64);
        t.equal(obj.messageString, 'msg');
        t.end()
    });
    t.test("nulls", async (t) => {
        const obj = await BodyMeta.serialize({
            contentLengthFloat64Nullable: null,
            fileDataNullable: null,
        })
        const props = Object.keys(obj);
        t.false(props.includes('contentLengthFloat64Nullable'), 'should not include default nullable null')
        t.false(props.includes('fileDataNullable'), 'should not include default nullable null')
        t.end()
    });
    t.test("default null", async (t) => {
        const obj = await BodyMeta.serialize({
            messageStringNullable: null,
        })
        const props = Object.keys(obj);
        t.false(props.includes('messageStringNullable'))
        t.end()
    });
    t.test("nullable set", async (t) => {
        const obj = await BodyMeta.serialize({
            messageStringNullable: 'val',
        })
        const props = Object.keys(obj);
        t.true(props.includes('messageStringNullable'))
        t.equal(obj.messageStringNullable, 'val')
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