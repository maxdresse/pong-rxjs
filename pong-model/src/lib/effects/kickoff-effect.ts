import { BALL_KICKOFF_DELTA_X, KICKOFF_DELAY } from '../physical-constants';
import { BALL_KICKOFF_VELOCITY } from '../physical-constants';
import { GameEffect, Player } from '../types';

export function createKickoffEffect(playerToReceiveBall: Player): GameEffect {
    return {
        apply: ({ ballBody }) => {
            ballBody.SetEnabled(false);
            ballBody.SetTransformXY(playerToReceiveBall === Player.PLAYER2 ? -BALL_KICKOFF_DELTA_X : BALL_KICKOFF_DELTA_X, 0, 0);
            ballBody.SetAngularVelocity(0);
            const dir = { x: 0, y: 0 };
            dir.x = playerToReceiveBall === Player.PLAYER1 ? -BALL_KICKOFF_VELOCITY : BALL_KICKOFF_VELOCITY;
            ballBody.SetLinearVelocity(dir)
            setTimeout(() => {
                ballBody.SetEnabled(true);
            }, KICKOFF_DELAY);
        }
    };
}