import { b2Vec2 } from '@box2d/core';
import { GameEffect, GameSituation, Player } from '../types';

export function createBigPlayerSlowdownEffect({ player }: {player: Player;} ):  GameEffect {
    return {
        apply: ({ playerBodies }: GameSituation) => {
            const body = playerBodies[player];
            if (!body) {
                return;
            }
            setTimeout(() => {
                body.SetLinearVelocity(body.GetLinearVelocity().Clone().Scale(0.35));
            }, 0);
        }
    }
};
