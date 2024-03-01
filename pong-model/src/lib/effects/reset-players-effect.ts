import { b2Vec2 } from '@box2d/core';
import { GameEffect, Player } from '../types';
import { FIRST_PLAYER_START_POS, SECOND_PLAYER_START_POS } from '../physical-constants';

export function createResetPlayersEffect(): GameEffect {
    return {
        apply: ({ playerBodies }) => {
            playerBodies
                .filter(b => !!b)
                .forEach((body, idx) => {
                    body.SetLinearVelocity(b2Vec2.ZERO);
                    const startPos =  idx === Player.PLAYER1 ? FIRST_PLAYER_START_POS : SECOND_PLAYER_START_POS;
                    body.SetTransformXY(startPos.x, startPos.y, 0);
            });
        }
    };
}