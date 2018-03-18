/*
import { Subject } from "rxjs/Subject";
import { tap } from 'rxjs/operators';
import { Observable } from "rxjs/Observable";
export function NgfmConnectorHooks() {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        Object.keys(constructor.prototype).forEach(methodName => {
            if (typeof constructor.prototype[methodName] !== 'function') {
                return;
            }
            const originalMethod = constructor.prototype[methodName];
            constructor.prototype[methodName] = function (...args) {
                this.beforeMethod$.next({ method: methodName, args });
                let methodResult = originalMethod.apply(this, args);
                if (methodResult instanceof Observable) {
                    constructor.prototype.showOverlay(true);
                    methodResult = methodResult.pipe(tap(result => {
                        this.afterMethod$.next({ method: methodName, args, result });
                        constructor.prototype.showOverlay(false);
                    }));
                }
                return methodResult;
            };
        });
        return class extends constructor {
        }
    }
}
*/