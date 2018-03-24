import { NgfmFile } from './ngfm-file';
import { NgfmItem } from './ngfm-item';
export class NgfmFolder extends NgfmItem {
    readonly itemType = 'folder';
    root: string[];
    path: string[];
    constructor(root: string[], path: string[]) {
        super({ root, path });
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
    static joinPath(...parts: string[][]) {
        return [...parts.reduce((a, c) => [...a, ...c], [])].join('/');
    }
}
