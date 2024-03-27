import { b2PolygonShape } from '@box2d/core';
import { GameEffect, Player } from '../types';
import { PLAYER_ENLARGED_SIZE, PLAYER_SIZE } from '../physical-constants';
import { DEFAUL_MUTATION_DURATION } from '../physical-constants';
import { scheduleRevertFct } from '../schedule-revert-fct';

export function createEnlargePlayerEffect(player: Player, duration = DEFAUL_MUTATION_DURATION): GameEffect {
    return {
        apply: ({ playerBodies, params }) => {
            const body = playerBodies[player];
            const fixture = body.GetFixtureList();
            if (!fixture) {
                return;
            }
            const shape = fixture.GetShape() as b2PolygonShape;
            shape.SetAsBox(PLAYER_ENLARGED_SIZE.x / 2, PLAYER_ENLARGED_SIZE.y / 2);
            scheduleRevertFct(() => {
                shape.SetAsBox(PLAYER_SIZE.x / 2, PLAYER_SIZE.y / 2);
            }, duration, params.revertPlayerEffectFcts);
        }
    };
}
