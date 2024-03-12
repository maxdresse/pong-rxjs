import { GameSituation, Player, ValueType } from '../types';

export const STATS_ENTRIES: Array<{ attrId: string; label: string; getValue: (gs: GameSituation) => ValueType; }> = [
    {
        attrId: 'p1x',
        label: 'P1 Velocity x',
        getValue: (gameSituation: GameSituation) => {
            return gameSituation.playerBodies[Player.PLAYER1].GetLinearVelocity().x;
        }
    }
];
