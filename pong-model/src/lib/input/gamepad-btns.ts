import { SymbolicButton, SymbolicButtonCombination } from './btn';

export const enum GpBtnIdx {
    B = 0,
    A = 1,
    Y = 2,
    X = 3,
    L1 = 4,
    R1 = 5,
    L2 = 6,
    R2 = 7
}

const gpBtnIdxToSymbBtn: Record<GpBtnIdx, SymbolicButton> = {
    [GpBtnIdx.A]: SymbolicButton.A,
    [GpBtnIdx.B]: SymbolicButton.B,
    [GpBtnIdx.X]: SymbolicButton.X,
    [GpBtnIdx.Y]: SymbolicButton.Y,
    [GpBtnIdx.L1]: SymbolicButton.L1,
    [GpBtnIdx.L2]: SymbolicButton.L2,
    [GpBtnIdx.R1]: SymbolicButton.R1,
    [GpBtnIdx.R2]: SymbolicButton.R2,
}

export function getSymbolicButtonCombination(gp: Gamepad): SymbolicButtonCombination {
    let result = 0;
    gp.buttons.forEach((bt, idx) => {
        if (bt.pressed) {
            result += gpBtnIdxToSymbBtn[idx as GpBtnIdx];
        }
    });
    return result;
}