import { NgfmFile } from "../models/ngfm-file";
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subject } from "rxjs/Subject";

export class NgfmUploadStatus {
    files: NgfmFile[];
    sentFiles: NgfmFile[] = [];
    get fileCount(): number { return this.files.length; }
    get sentCount(): number { return this.sentFiles.length; }
    get remainingCount(): number { return this.fileCount - this.sentCount; }
    currentProgress$: BehaviorSubject<number> = new BehaviorSubject(0);
    progress$: Observable<number>;
    progressPct$: Observable<number>;
    complete$: Subject<NgfmFile[]> = new Subject();
    constructor(files: NgfmFile[]) {
        this.files = files;
        this.progress$ = this.currentProgress$.pipe(
            map(currentProgress => this.remainingCount ? (this.sentCount + currentProgress) / this.fileCount : 1)
        );
        this.progressPct$ = this.progress$.pipe(
            map(progress => Math.round(100 * progress))
        );
    }
    fileDone(file: NgfmFile) {
        this.sentFiles.push(file);
        this.currentProgress$.next(0);
        if (!this.remainingCount) {
            this.complete$.next(this.files);
        }
    }
}