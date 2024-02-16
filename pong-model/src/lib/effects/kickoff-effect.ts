import { BALL_KICKOFF_VELOCITY } from '../physical-constants';
import { GameEffect, Player } from '../types';

export function createKickoffEffect(playerToReceiveBall: Player): GameEffect {
    return {
        apply: ({ ballBody }) => {
            ballBody.SetTransformXY(0, 0, 0);
            ballBody.SetAngularVelocity(0);
            const dir = { x: 0, y: 0 };
            dir.x = playerToReceiveBall === Player.PLAYER1 ? -BALL_KICKOFF_VELOCITY : BALL_KICKOFF_VELOCITY;
            ballBody.SetLinearVelocity(dir)
        }
    };
}