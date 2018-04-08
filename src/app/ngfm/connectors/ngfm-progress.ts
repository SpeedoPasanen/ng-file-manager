import { Observable } from 'rxjs/Observable';
import { NgfmFile } from '../models/ngfm-file';
import { share, map, startWith } from 'rxjs/operators';
export class NgfmProgress {
    /**
     * Progress between 0 and 1
     */
    progress?: Observable<number>

    /**
     * Nexts one time, then completes.
     */
    success: Observable<boolean | NgfmFile[]>
    constructor(success: Observable<boolean | NgfmFile[]>, progress?: Observable<number>) {
        this.success = success.pipe(share());
        this.progress = progress || this.success.pipe(
            map((n: any) => 1)
        );
    }

}