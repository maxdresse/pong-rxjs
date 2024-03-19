import { HandicapType } from '../types';
import { SymbolicButton, SymbolicButtonCombination } from './btn';

export const COMBO_DEFINITIONS:  Array<[HandicapType, Array<SymbolicButtonCombination>]> = 
    [
        [HandicapType.OPPONENT_ENLARGED, []]
    ];

const charToSym = {
    a: SymbolicButton.A,
    b: SymbolicButton.B,
    x: SymbolicButton.X,
    y: SymbolicButton.Y,
    l1: SymbolicButton.L1,
    l2: SymbolicButton.L2
};

function defineCombination(btnString: string): SymbolicButtonCombination {
    const result: SymbolicButtonCombination;
    for (const char of btnString) {
        const sym = charToSym[char];
   }
   return result;
}