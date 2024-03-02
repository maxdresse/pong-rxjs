import { Player } from './types';

export const playerType = 'player';
export const wallType = 'wall';
export const goalType = 'goal';
export const ballType = 'ball';
export const fenceType = 'fence';

export type BallUserData = ReturnType<typeof getBallUserData>;

export type PlayerUserData = ReturnType<typeof getPlayerUserData>;

export type GoalUserData = ReturnType<typeof getGoalUserData>;

export type WallUserData = ReturnType<typeof getWallUserData>;

export type FenceUserData = ReturnType<typeof getFenceUserData>;

export type UserDataUnion = BallUserData |
    PlayerUserData |
    GoalUserData |
    WallUserData |
    FenceUserData

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