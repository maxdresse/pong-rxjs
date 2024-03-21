import { b2Vec2 } from '@box2d/core';
import { GameEffect, GameSituation, Player, Vc2 } from '../types';
import { MOVE_IMPULSE_FACTOR } from '../physical-constants';

export function createMovePlayerEffect({ player, direction }: {player: Player; direction: Vc2} ):  GameEffect {
    return {
        apply: ({ playerBodies, params }: GameSituation) => {
            if (params.paused) {
                return;
            }
            const body = playerBodies[player];
            if (!body) {
                return;
            }
            const d = new b2Vec2(direction.x, direction.y);
            if (!d.Normalize()) {
                return;
            }
            if (params.control[player].inverted) {
                d.Scale(-1);
            }
            body.ApplyLinearImpulseToCenter(d.Scale(MOVE_IMPULSE_FACTOR));
        }
    }
};
