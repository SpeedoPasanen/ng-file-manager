import { NgfmPerms } from './ngfm-perms';
export class NgfmConfig {
    perms?: NgfmPerms = new NgfmPerms();
    xsCols?= 2;
    smCols?= 4;
    mdCols?= 6;
    lgCols?= 8;
    xlCols?= 10;
    constructor(init: NgfmConfig = {}) {
        Object.assign(this, init);
    }
}
