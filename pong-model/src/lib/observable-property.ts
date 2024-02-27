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

export function addObservableProperty<Ob extends Record<string, any>, T, K extends string, KK extends string>(obj: Ob, propName: K, propNameForObs: KK, initialVal: T) {
    const v$ = new BehaviorSubject<T>(initialVal);
    if (!!obj[propName]) {
        throw Error('cannot overwrite existing property ' + propName);
    }
    Object.defineProperty(obj, propName, {
        get: function() {
            return v$.getValue();
        },
        set: function(x) {
            v$.next(x);
        }
    });
    if (!!obj[propNameForObs]) {
        throw Error('cannot overwrite existing property ' + propNameForObs);
    }
    (obj as { [key in typeof propNameForObs]: Observable<T> } )[propNameForObs] = v$.asObservable();
    const objWithType = obj as Ob & { [key in typeof propNameForObs]: Observable<T> } & { [key in typeof propName]: T }
    return objWithType;
}