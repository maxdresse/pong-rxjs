import { GameIntent, Player, Vc2 } from '../types';

export interface MovePlayerPayload {
    player: Player;
    direction: Vc2;
};

export const MOVE_PLAYER_INTENT = 12;

export type MovePlayerIntent = GameIntent<typeof MOVE_PLAYER_INTENT, MovePlayerPayload>;

export function createMovePlayerIntent(payload: MovePlayerPayload): MovePlayerIntent {
    return {
        type: MOVE_PLAYER_INTENT,
        payload
    };
}