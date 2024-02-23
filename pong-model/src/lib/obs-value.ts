import { BehaviorSubject, Observable } from 'rxjs';

export function createObsValue<T, K extends string>(propName: K, initialVal: T): [ { K: T }, Observable<T> ] {
    const v$ = new BehaviorSubject<T>(initialVal);
    return [
        {
            get [propName]() {
                return v$.getValue();
            },
            set [propName](newS: T) {
                v$.next(newS);
            }
        } as { K: T}, 
        v$.asObservable()
    ];
}