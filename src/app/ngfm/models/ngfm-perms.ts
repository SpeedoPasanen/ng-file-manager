
export class NgfmPerms {
    createFile?= true;
    editFile?= true;
    removeFile?= true;
    createFolder?= true;
    editFolder?= true;
    removeFolder?= true;
    constructor(init: NgfmPerms = {}) {
        Object.assign(this, init);
    }
    static ALL: NgfmPerms = {
        createFile: true,
        editFile: true,
        removeFile: true,
        createFolder: true,
        editFolder: true,
        removeFolder: true
    }
    static NONE: NgfmPerms = {
        createFile: false,
        editFile: false,
        removeFile: false,
        createFolder: false,
        editFolder: false,
        removeFolder: false
    }
    static ALL_FILES: NgfmPerms = {
        createFile: true,
        editFile: true,
        removeFile: true,
        createFolder: false,
        editFolder: false,
        removeFolder: false
    }
    static ALL_FOLDERS: NgfmPerms = {
        createFile: false,
        editFile: false,
        removeFile: false,
        createFolder: true,
        editFolder: true,
        removeFolder: true
    }
}