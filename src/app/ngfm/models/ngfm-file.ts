import { NgfmFolder } from './public_api';

export class NgfmFile {
    folder: NgfmFolder;

    /**
     * In case we're using this instance for uploading, save reference to the original native File.
     */
    nativeFile: File;

    /**
     * Full name eg. `my_pic.jpg`
     */
    name = '';

    /**
     * Lower case extension without comma, eg. `jpg`
     */
    extension = '';

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
     * Absolute URLs for different use cases.
     */
    urls: {
        serve: string;
        download: string;
        thumbnail: string;
    };

    constructor(folder: NgfmFolder, init: File | any) {
        console.log('init', init);
        this.folder = folder;
        Object.keys(this).forEach(key => key in init ? this[key] = init[key] : null);
        this.extension = this.name.replace(/[^\.]*./, '').toLowerCase();
        this.nativeFile = init instanceof File ? init : null;
        this.humanSize = this.getHumanSize();
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

}
