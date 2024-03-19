import { HandicapType } from '../types';
import { SymbolicButtonCombination } from './btn';

export const COMBO_DEFINITIONS: { [key in HandicapType]: Array<SymbolicButtonCombination> } = {
    [HandicapType.OPPONENT_ENLARGED]
};
