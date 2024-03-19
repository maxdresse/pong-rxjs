import { map } from 'rxjs';

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
