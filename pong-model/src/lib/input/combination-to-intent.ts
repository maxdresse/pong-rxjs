import { onCombo } from './combo';
import { Observable, map, merge } from 'rxjs';
import { Player, SomeGameIntent } from '../types';
import { SymbolicButtonCombination } from './btn';
import { COMBO_DEFINITIONS } from './combo-definitions';

export function combinationToIntent(comb$: Observable<SymbolicButtonCombination>, player: Player): Observable<SomeGameIntent> {
    const combo$s = COMBO_DEFINITIONS.map(([sequence, intentFactory]) => {
        return comb$.pipe(
            onCombo(sequence),
            map(_ => intentFactory(player))
        );
    });
    return merge(...combo$s);
}
