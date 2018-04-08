import { Observable } from 'rxjs/Observable';
export interface NgfmProgress {

    /**
     * Progress between 0 and 1
     */
    progress: Observable<number>

    /**
     * Nexts one time, then completes.
     */
    success: Observable<boolean>
}