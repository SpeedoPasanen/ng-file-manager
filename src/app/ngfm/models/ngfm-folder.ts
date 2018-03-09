import { NgfmFile } from './ngfm-file';
export class NgfmFolder {
    name: string;
    root: string[];
    path: string[];
    fullPath: string[];
    constructor(root: string[], path: string[]) {
        Object.assign(this, { root, path, fullPath: [...root, ...path] });
        this.name = path[path.length - 1] || root[root.length - 1] || '';
    }
    toString() {
        return this.fullPath.join('/');
    }
    get parent(): NgfmFolder | null {
        if (!this.path.length) {
            return null;
        }
        return new NgfmFolder(this.root, this.path.slice(0, -1));
    }
}
