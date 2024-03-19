import { HandicapType } from '../types';
import { SymbolicButton, SymbolicButtonCombination } from './btn';

const dc = defineCombination;

export const COMBO_DEFINITIONS:  Array<[HandicapType, Array<SymbolicButtonCombination>]> = 
    [
        [HandicapType.OPPONENT_ENLARGED, [dc('xyab')]]
    ];

const charToSym: Record<string, SymbolicButton> = {
    a: SymbolicButton.A,
    b: SymbolicButton.B,
    x: SymbolicButton.X,
    y: SymbolicButton.Y,
    l1: SymbolicButton.L1,
    l2: SymbolicButton.L2
};

function defineCombination(btnString: string): SymbolicButtonCombination {
    let result: SymbolicButtonCombination = 0;
    for (const char of btnString) {
        const sym = charToSym[char];
        if (sym == undefined) {
            throw Error('illegal sequence');
        }
        result += sym;
   }
   return result;
}