import { b2Vec2 } from '@box2d/core';
import { GameEffect, GameSituation, Player, Vc2 } from '../types';
import { MOVE_IMPULSE_FACTOR } from '../physical-constants';

export function createMovePlayerEffect({ player, direction }: {player: Player; direction: Vc2} ):  GameEffect {
    return {
        apply: ({ playerBodies }: GameSituation) => {
            const body = playerBodies[player];
            if (!body) {
                return;
            }
            const d = new b2Vec2(direction.x, direction.y);
            if (!d.Normalize()) {
                return;
            }
            body.ApplyLinearImpulseToCenter(d.Scale(MOVE_IMPULSE_FACTOR));
        }
    }
};
