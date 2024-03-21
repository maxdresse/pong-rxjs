import { b2PolygonShape } from '@box2d/core';
import { GameEffect, Player } from '../types';
import { PLAYER_SIZE, PLAYER_SMALL_SIZE } from '../physical-constants';
import { DEFAUL_MUTATION_DURATION } from '../physical-constants';

export function createShrinkPlayerEffect(player: Player, duration = DEFAUL_MUTATION_DURATION): GameEffect {
    return {
        apply: ({ playerBodies }) => {
            const body = playerBodies[player];
            const fixture = body.GetFixtureList();
            if (!fixture) {
                return;
            }
            const shape = fixture.GetShape() as b2PolygonShape;
            shape.SetAsBox(PLAYER_SMALL_SIZE.x / 2, PLAYER_SMALL_SIZE.y / 2);
            setTimeout(() => {
                shape.SetAsBox(PLAYER_SIZE.x / 2, PLAYER_SIZE.y / 2);
            }, duration)
        }
    };
}
