
export class NgfmPerms {
    createFile?= true;
    editFile?= true;
    removeFile?= true;
    createFolder?= true;
    editFolder?= true;
    removeFolder?= true;
    constructor(init: NgfmPerms = null) {
        Object.assign(this, init || {});
    }
    static ALL: NgfmPerms = {
        createFile: true,
        editFile: true,
        removeFile: true,
        createFolder: true,
        editFolder: true,
        removeFolder: true,
        hasAny: true
    }
    static NONE: NgfmPerms = {
        createFile: false,
        editFile: false,
        removeFile: false,
        createFolder: false,
        editFolder: false,
        removeFolder: false,
        hasAny: false
    }
    static ALL_FILES: NgfmPerms = {
        createFile: true,
        editFile: true,
        removeFile: true,
        createFolder: false,
        editFolder: false,
        removeFolder: false,
        hasAny: true
    }
    static ALL_FOLDERS: NgfmPerms = {
        createFile: false,
        editFile: false,
        removeFile: false,
        createFolder: true,
        editFolder: true,
        removeFolder: true,
        hasAny: true
    }
    get hasAny() {
        for (let n of Object.keys(this)) {
            if (this[n]) { return true; }
        }
        return false;
    }
}