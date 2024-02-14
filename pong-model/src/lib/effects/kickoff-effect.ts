import { GameEffect, Player } from '../types';

export function createKickoffEffect(playerToReceiveBall: Player): GameEffect {
    return {
        apply: ({ ballBody }) => {
            ballBody.SetTransformXY(0, 0, 0);
            ballBody.SetAngularVelocity(0);
            const dir = { x: 0, y: 0 };
            dir.x = playerToReceiveBall === Player.PLAYER1 ? -0.015 : 0.015;
            ballBody.SetLinearVelocity(dir)
        }
    };
}