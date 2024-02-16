import { Player } from './types';

export const playerType = 'player';
export const wallType = 'wall';
export const goalType = 'goal';
export const ballType = 'ball';
export const fenceType = 'fence';

export type UserDataUnion = ReturnType<typeof getBallUserData> |
    ReturnType<typeof getPlayerUserData> |
    ReturnType<typeof getGoalUserData> |
    ReturnType<typeof getWallUserData> |
    ReturnType<typeof getFenceUserData>;

export function getWallUserData() {
    return { type: wallType } as const;
}

export function getGoalUserData(owningPlayer: Player) {
    return { type: goalType, owningPlayer } as const;
}

export function getPlayerUserData(player: Player) {
    return { type: playerType, player } as const;
}

export function getBallUserData() {
    return { type: ballType } as const;
}

export function getFenceUserData() {
    return { type: fenceType } as const;
}