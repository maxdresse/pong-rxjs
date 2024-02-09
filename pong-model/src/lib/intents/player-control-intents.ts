import { GameIntent, Player, Vc2 } from '../types';

export interface MovePlayerPayload {
    player: Player;
    direction: Vc2;
};

export const MovePlayerTypeId = 12;

export type MovePlayerIntent = GameIntent<typeof MovePlayerTypeId, MovePlayerPayload>;
