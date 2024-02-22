export function forOneOrMany<T>(a: T | Array<T>, fn: (t: T) => void) {
    if (Array.isArray(a)) {
        a.forEach(el => fn(el));
    } else {
        fn(a);
    }
}