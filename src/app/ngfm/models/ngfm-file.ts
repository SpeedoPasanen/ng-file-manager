import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { NgfmFolder } from './ngfm-folder';
import { NgfmItem } from './ngfm-item';
export class NgfmFile extends NgfmItem {
    folder: NgfmFolder;
    readonly itemType = 'file';
    /**
     * In case we're using this instance for uploading, save reference to the original native File.
     */
    nativeFile: File;

    /**
     * Lower case extension without comma, eg. `jpg`
     */
    extension = '';

    /**
     * 0 Byte files and files without a type are considered invalid (possibly folders) and shall not be uploaded
     */
    isValid = true;

    /**
     * UNIX timestamp
     */
    lastModified = new Date().getTime();
    lastModifiedDate = new Date();

    /**
     * MIME type eg. `image/jpeg`
     */
    type = '';

    /**
     * Size in bytes
     */
    size = 0;

    /**
     * See getHumanSize()
     */
    humanSize: { value: number, unit: string };

    /**
     * URL where the file is served
     */
    url: string = '';
    private _download: string;
    private _thumbnail: string;

    /**
     * Optional download URL. Returns `this.url` when not set.
     */
    get download(): string { return this._download || this.url; }
    set download(s: string) { this._download = s; }

    /**
     * Optional thumbnail URL. Returns `this.url` when not set.
     */
    get thumbnail(): string { return this._thumbnail || this.url; }
    set thumbnail(s: string) { this._thumbnail = s; }

    constructor(folder: NgfmFolder, init: File | any) {
        super(init);
        this.folder = folder;
        Object.keys(this).forEach(key => key in init ? this[key] = init[key] : this[key]);
        this.extension = this.name.replace(/[^\.]*./, '').toLowerCase();
        this.nativeFile = init instanceof File ? init : null;
        this.humanSize = this.getHumanSize();
        // File is invalid if: No size or no extension, except `.htaccess` etc.
        // @TODO add replaceable validator class, so user can decide which files are valid
        this.isValid = (!!this.size) && (!!this.extension || /^\.[^\.]+/.test(this.name));
        this.type = ('' + this.type).toLowerCase();
    }


    /**
     * Size normalized to an appropriate unit, eg. 1 MB instead of 1048576 B
     * @returns { value: number, unit: string}
     * eg. { value: 1, unit: 'MB'}
     */
    protected getHumanSize(): { value: number, unit: string } {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let value = this.size;
        let unit = units.splice(0, 1).pop();
        while (value >= 1024 && units.length) {
            unit = units.splice(0, 1).pop();
            value /= 1024;
        }
        return { value, unit };
    }

    private read(subscriber: Subscriber<any>): FileReader {
        if (!this.nativeFile) {
            throw Error(`You tried to read an NgfmFile that doesn't have a nativeFile: ` + JSON.stringify(this));
        }
        const reader = new FileReader();
        reader.onloadend = () => subscriber.next(reader.result);
        return reader;
    }
    readDataURL(): Observable<string> {
        return new Observable(subscriber => {
            const reader = this.read(subscriber);
            reader.readAsDataURL(this.nativeFile);
        })
    }
    readArrayBuffer(): Observable<ArrayBuffer> {
        return new Observable(subscriber => {
            const reader = this.read(subscriber);
            reader.readAsArrayBuffer(this.nativeFile);
        })
    }
    readBinaryString(): Observable<any> {
        return new Observable(subscriber => {
            const reader = this.read(subscriber);
            reader.readAsBinaryString(this.nativeFile);
        })
    }
    readText(): Observable<string> {
        return new Observable(subscriber => {
            const reader = this.read(subscriber);
            reader.readAsText(this.nativeFile);
        })
    }

    /**
     * Helper for checking MIME type
     */
    get isImage() { return /image/.test(this.type); }
    /**
     * Helper for checking MIME type
     */
    get isVideo() { return /video/.test(this.type); }
    /**
     * Helper for checking MIME type
     */
    get isText() { return /text/.test(this.type); }
}
