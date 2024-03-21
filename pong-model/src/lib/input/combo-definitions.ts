import { createEnlargePlayerIntent } from '../intents/enlarge-player-intent';
import { createMakeBarelyVisibleIntent } from '../intents/make-barely-visible-intent';
import { createShrinkPlayerIntent } from '../intents/shrink-player-intent';
import { otherPlayer } from '../player-utils';
import { Player, SomeGameIntent } from '../types';
import { SymbolicButton, SymbolicButtonCombination } from './btn';

const CHORD_SEPARATOR = '|';

const charToSym: Record<string, SymbolicButton> = {
    a: SymbolicButton.A,
    b: SymbolicButton.B,
    x: SymbolicButton.X,
    y: SymbolicButton.Y,
    l: SymbolicButton.L1,
    L: SymbolicButton.L2,
    r: SymbolicButton.R1,
    R: SymbolicButton.R2
};

const dc = defineCombination;

export const COMBO_DEFINITIONS:  Array<[Array<SymbolicButtonCombination>, (player: Player) => SomeGameIntent]> = 
    [
        [dc('y|x|l'), playerThatOwnsBtn => createShrinkPlayerIntent(otherPlayer(playerThatOwnsBtn))],
        [dc('y|x|L'), playerThatOwnsBtn => createMakeBarelyVisibleIntent(otherPlayer(playerThatOwnsBtn))]
    ];

function defineCombination(btnString: string): Array<SymbolicButtonCombination> {
    btnString = btnString ?? '';
    const result: Array<SymbolicButtonCombination> = [];
    const chords = btnString.split(CHORD_SEPARATOR)
        .filter(x => !!x);
    chords.forEach(chord => {
        let chordComb = 0;
        for (const char of chord) {
            const sym = charToSym[char];
            if (sym == undefined) {
                throw Error('illegal sequence');
            }
            chordComb += sym;
        }
        result.push(chordComb);
    });
   return result;
}