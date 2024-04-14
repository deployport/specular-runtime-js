import test from 'tape';
import {SpecularPackage} from './generated-client/specular.js';

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