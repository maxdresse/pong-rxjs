import { Observable, filter, map } from 'rxjs';

export const enum SymbolicButton {
    A = 1,
    B = 2,
    X = 4,
    Y = 8,
    L1 = 16,
    L2 = 32,
    R1 = 64,
    R2 = 128
}

// don't have a stronger type for the time being
export type SymbolicButtonCombination = number;

function onCombo(sequence: Array<SymbolicButtonCombination>, stepTimeout: number): (src$: Observable<SymbolicButtonCombination>) => Observable<void> {
    let currentIdx = 0;
    const lastIndex = sequence.length - 1;
    let to: ReturnType<typeof setTimeout>;
    const reset = () => {
        currentIdx = 0;
    }
    return src$ => src$.pipe(
        filter(combination => {
            to = setTimeout(reset, stepTimeout);
            if (currentIdx > lastIndex) {
                clearTimeout(to);
                return true;
            }
            if (sequence[currentIdx] === combination) {
                // match
                currentIdx++;
                clearTimeout(to);
                return currentIdx > lastIndex;
            } else {
                // no match => reset
                reset();
            }
            clearTimeout(to);
            return false;
        }),
        map(_ => undefined)
    );
}