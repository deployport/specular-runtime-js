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

test('Hydrate', (t) => {
    const obj = {
        "body": null
    };
    const s = _pkg.requireBuildFromJSON(ResponseMeta.path, obj);
    t.equal(s.body, null);
    t.end();
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