export class NgfmItem {
    /**
     * Full name eg. `my_pic.jpg`
     */
    name = '';
    /**
      * UNIX timestamp
      */
    lastModified = new Date().getTime();
    lastModifiedDate: Date;
    created = new Date().getTime();
    createdDate: Date;

    selected = false;
    hash: string; // Unique identifier made from all properties
    readonly itemType: string;
    get isFile() { return this.itemType === 'file'; }
    get isFolder() { return this.itemType === 'folder'; }
    constructor(init: any) {
        this.hash = (<any>Object).entries(init).reduce((acc, cur) => `${acc}#${cur.join('|')}`, '');
        this.lastModifiedDate = init.lastModifiedDate ? init.lastModifiedDate : (init.lastModified ? new Date(init.lastModified) : new Date());
        this.createdDate = init.createdDate ? init.createdDate : (init.created ? new Date(init.created) : new Date());
    }
}