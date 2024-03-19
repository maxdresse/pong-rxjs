import { HandicapType } from '../types';
import { SymbolicButton, SymbolicButtonCombination } from './btn';

export const COMBO_DEFINITIONS:  Array<[HandicapType, Array<SymbolicButtonCombination>]> = 
    [
        [HandicapType.OPPONENT_ENLARGED, []]
    ];

function defineCombination(btnString: string): SymbolicButtonCombination {
    const result: SymbolicButtonCombination;
    for (const char of btnString) {

   }
   return result;
}