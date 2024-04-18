import test from 'tape';
import {SpecularPackage} from './generated-client/specular.js';
import {
    Metadata,
} from '../lib/index.js';


const _pkg = SpecularPackage();

test('Hydrate', (t) => {
    const obj = {
        __type: "SpecularJS/TestPackage:Response",
        "body": null
    };
    t.equal("SpecularJS/TestPackage:Response", obj.__type);
    const s = _pkg.requireBuildFromJSON(obj);
    t.equal(s.body, null);
    t.end();
});

const importingPkg = new Metadata.Package(
    'SpecularJS/Importing',
);
importingPkg.importPackage(_pkg);

export const ImportingDoc = new Metadata.Struct(
    importingPkg, 
    "Doc", 
);

test('imported instantiation', (t) => {
    const obj = {
        __type: "SpecularJS/TestPackage:Response",
        "body": null
    };
    const s = importingPkg.requireBuildFromJSON(obj);
    t.equal(s.body, null);
    t.end();
});
