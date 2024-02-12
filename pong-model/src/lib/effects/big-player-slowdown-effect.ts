import { PLAYER_WALL_SLOWDOWN_FACTOR } from '../physical-constants';
import { GameEffect, GameSituation, Player } from '../types';

export function createBigPlayerSlowdownEffect({ player }: {player: Player;} ):  GameEffect {
    return {
        apply: ({ playerBodies }: GameSituation) => {
            const body = playerBodies[player];
            if (!body) {
                return;
            }
            setTimeout(() => {
                body.SetLinearVelocity(body.GetLinearVelocity().Clone().Scale(PLAYER_WALL_SLOWDOWN_FACTOR));
            }, 0);
        }
    }
};
