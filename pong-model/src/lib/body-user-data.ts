import { Player } from './types';

const playerType = 'player';
const wallType = 'wall';
const goalType = 'goal';
const ballType = 'ball';

export type UserDataUnion = ReturnType<typeof getBallUserData> |
    ReturnType<typeof getPlayerUserData> |
    ReturnType<typeof getGoalUserData> |
    ReturnType<typeof getWallUserData>;

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