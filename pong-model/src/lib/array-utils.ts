export function forOneOrMany<T>(a: T | Array<T>, fn: (t: T) => void) {
    if (Array.isArray(a)) {
        a.forEach(el => fn(el));
    } else {
        fn(a);
    }
}

export function ensurePrepended<T>(el: T, arr: Array<T>): void {
    const idx = arr.indexOf(el);
    if (idx < 0) {
        arr.unshift(el);
    }
}

export function ensureRemoved<T>(el: T, arr: Array<T>): void {
    const idx = arr.indexOf(el);
    if (idx >= 0) {
        arr.splice(idx, 1);
    }
}