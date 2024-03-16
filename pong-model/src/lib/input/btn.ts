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

function onCombo(sequence: Array<SymbolicButtonCombination>): (src$: Observable<SymbolicButtonCombination>) => Observable<void> {
    let currentIdx = 0;
    const lastIndex = sequence.length - 1;
    return src$ => src$.pipe(
        filter(combination => {
            if (currentIdx > lastIndex) {
                return true;
            }
            if (sequence[currentIdx] === combination) {
                // match
                currentIdx++;
                return currentIdx > lastIndex;
            } else {
                // no match => reset
                currentIdx = 0;
            }
            return false;
        }),
        map(_ => undefined)
    );
}