export class NgfmFolder {
    root: string[];
    path: string[];
    fullPath: string[];
    constructor(root: string[], path: string[]) {
        Object.assign(this, { root, path, fullPath: [...root, ...path] });
    }
    toString() {
        return this.fullPath.join('/');
    }
}
