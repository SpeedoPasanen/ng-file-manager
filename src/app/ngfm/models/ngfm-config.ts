import { NgfmPerms } from './ngfm-perms';
export class NgfmConfig {
    perms?: NgfmPerms = new NgfmPerms();
    /**
     * Target item width as pixels. Amount of columns in the list will be calculated based on this.
     */
    listItemSize?= 180;
    messages?= {
        RENAME: 'Rename',
        DELETE: 'Delete',
        MOVE: 'Move',
        UPLOAD: 'Upload',
        CREATE_FOLDER: 'Create Folder',
        SELECTED: 'selected',
        SELECT_ALL: 'Select All',
        PICK: 'Pick',
        DOWNLOAD: 'Download'
    }
    constructor(init?: NgfmConfig) {
        Object.assign(this, init || {});
    }
}
