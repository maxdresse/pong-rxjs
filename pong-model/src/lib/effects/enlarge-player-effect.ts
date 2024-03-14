import { b2PolygonShape } from '@box2d/core';
import { GameEffect, Player } from '../types';
import { PLAYER_ENLARGED_SIZE, PLAYER_SIZE } from '../physical-constants';

export function createEnlargePlayerEffect(player: Player, duration: number): GameEffect {
    return {
        apply: ({ playerBodies }) => {
            const body = playerBodies[player];
            const fixture = body.GetFixtureList();
            if (!fixture) {
                return;
            }
            const shape = fixture.GetShape() as b2PolygonShape;
            shape.SetAsBox(PLAYER_ENLARGED_SIZE.x / 2, PLAYER_ENLARGED_SIZE.y / 2);
            setTimeout(() => {
                shape.SetAsBox(PLAYER_SIZE.x / 2, PLAYER_SIZE.y / 2);
            }, duration)
        }
    };
}
