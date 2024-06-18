import test from 'tape';
import { SpecularPackage, ResponseMeta } from './generated-client/specular.js';
import {
    Metadata,
} from '../lib/index.js';
import { StructPath } from '../lib/metadata/struct.js';

const _pkg = SpecularPackage();

test('StructPath', (t) => {
    const sp = StructPath.fromString('application/spec.myns.mymod.mytype');
    t.equal(sp.name, "mytype");
    t.equal(sp.module.namespace, "myns");
    t.equal(sp.module.name, "mymod");
    t.end();
});

test('Hydrate with builtins props', (t) => {
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
        t.end();
    });
    t.test("value", (t) => {
        const obj = {
            "body": {
                "contentLengthInt32": 32,
                "contentLengthFloat64Nullable": 64,
                "messageString": "msg",
                "messageStringNullable": "msg nullable",
            }
        };
        const s = _pkg.requireBuildFromJSON(ResponseMeta.path, obj);
        t.notEqual(s.body, null);
        t.equal(s.body.contentLengthInt32, 32);
        t.equal(s.body.contentLengthFloat64Nullable, 64);
        t.equal(s.body.messageString, "msg");
        t.equal(s.body.messageStringNullable, "msg nullable");
        t.end();
    });
});

test('Hydrate with struct props', (t) => {
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