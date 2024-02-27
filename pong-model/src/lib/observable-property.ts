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

export function addObservableProperty<Ob, T, K extends string>(obj: Ob, propName: K, initialVal: T) {
    const v$ = new BehaviorSubject<T>(initialVal);
    Object.defineProperty(obj, propName, {
        get: function() {
            return v$.getValue();
        },
        set: function(x) {
            v$.next(x);
        }
    });
    return obj;
}