import { Observable, distinctUntilChanged, filter, map } from 'rxjs';

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

export function onCombo(sequence: Array<SymbolicButtonCombination>, stepTimeout: number): (src$: Observable<SymbolicButtonCombination>) => Observable<void> {
    let currentIdx = 0;
    const lastIndex = sequence.length - 1;
    let to: ReturnType<typeof setTimeout>;
    const reset = () => {
        currentIdx = 0;
    }
    return src$ => src$.pipe(
        distinctUntilChanged(), // only btn changes
        filter(x => !!x), // ignore empty btn presses
        filter(combination => {
            clearTimeout(to);
            let success = false;
            if (currentIdx > lastIndex) {
                success = true;
            } else if (sequence[currentIdx] === combination) {
                // match
                currentIdx++;
                success = currentIdx > lastIndex;
                if (!success) {
                    // match, but not yet done
                    // need to get to next step within timeout
                    to = setTimeout(reset, stepTimeout);
                } else {
                    // success => clean up
                    reset();
                }
            } else {
                // no match => reset
                reset();
            }
            return success;
        }),
        map(_ => undefined)
    );
}