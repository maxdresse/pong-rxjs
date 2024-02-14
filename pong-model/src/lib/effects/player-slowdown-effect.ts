import { PLAYER_WALL_SLOWDOWN_FACTOR } from '../physical-constants';
import { GameEffect, GameSituation, Player } from '../types';

export function createPlayerSlowdownEffect({ player, slowDownFactor }: {player: Player; slowDownFactor?: number} ):  GameEffect {
    return {
        apply: ({ playerBodies }: GameSituation) => {
            const body = playerBodies[player];
            if (!body) {
                return;
            }
            const factor = slowDownFactor ?? PLAYER_WALL_SLOWDOWN_FACTOR;
            body.SetLinearVelocity(body.GetLinearVelocity().Clone().Scale(factor));
        }
    }
};
