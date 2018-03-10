import { NgfmPerms } from './ngfm-perms';
export class NgfmConfig {
    perms?: NgfmPerms = new NgfmPerms();
    xsCols?= 2;
    smCols?= 3;
    mdCols?= 4;
    lgCols?= 6;
    xlCols?= 8;
    constructor(init: NgfmConfig = {}) {
        Object.assign(this, init);
    }
}
