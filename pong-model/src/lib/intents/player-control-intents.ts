import { GameIntent, Vc2 } from '../types';

export interface MovePlayerPayload {
    direction: Vc2;
};

export const MovePlayerTypeId = 12;

export type MovePlayerIntent = GameIntent<typeof MovePlayerTypeId, MovePlayerPayload>;
