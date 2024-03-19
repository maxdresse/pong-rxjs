import { createEnlargePlayerIntent } from '../intents/enlarge-player-intent';
import { otherPlayer } from '../player-utils';
import { Player, SomeGameIntent } from '../types';
import { SymbolicButton, SymbolicButtonCombination } from './btn';

const charToSym: Record<string, SymbolicButton> = {
    a: SymbolicButton.A,
    b: SymbolicButton.B,
    x: SymbolicButton.X,
    y: SymbolicButton.Y,
    l1: SymbolicButton.L1,
    l2: SymbolicButton.L2
};

const dc = defineCombination;

export const COMBO_DEFINITIONS:  Array<[Array<SymbolicButtonCombination>, (player: Player) => SomeGameIntent]> = 
    [
        [dc('xyab'), playerThatOwnsBtn => createEnlargePlayerIntent(otherPlayer(playerThatOwnsBtn))]
    ];

function defineCombination(btnString: string): Array<SymbolicButtonCombination> {
    const result: Array<SymbolicButtonCombination> = [];
    for (const char of btnString) {
        const sym = charToSym[char];
        if (sym == undefined) {
            throw Error('illegal sequence');
        }
        result.push(sym);
   }
   return result;
}