import { BehaviorSubject, Observable } from 'rxjs';

export function createObservableProperty<T, K extends string>(propName: K, initialVal: T): [ { [key in K]: T }, Observable<T> ] {
    const v$ = new BehaviorSubject<T>(initialVal);
    return [
        {
            get [propName]() {
                return v$.getValue();
            },
            set [propName](newS: T) {
                v$.next(newS);
            }
        } as { [key in K]: T}, 
        v$.asObservable()
    ];
}