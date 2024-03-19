import { SymbolicButtonCombination } from './btn';

import { Observable, distinctUntilChanged, filter, map, merge } from 'rxjs';
import { COMBO_STEP_TIMEOUT } from './input-constants';
import { COMBO_DEFINITIONS } from './combo-definitions';
import { createHandicapIntent } from '../intents/handicap-intent';
import { Player, SomeGameIntent } from '../types';

export function combiToIntent(comb$: Observable<SymbolicButtonCombination>, player: Player): Observable<SomeGameIntent> {
    const combo$s = COMBO_DEFINITIONS.map(([type, sequence]) => {
        return comb$.pipe(
            onCombo(sequence),
            map(_ => createHandicapIntent(player, type))   
        )
    });
    return merge(...combo$s);
}

export function onCombo(sequence: Array<SymbolicButtonCombination>, stepTimeout = COMBO_STEP_TIMEOUT): (src$: Observable<SymbolicButtonCombination>) => Observable<SymbolicButtonCombination> {
    let currentIdx = 0;
    const lastIndex = sequence.length - 1;
    let to: ReturnType<typeof setTimeout>;
    const reset = () => {
        currentIdx = 0;
    };
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
        })
    );
}
