import { createPlayerSlowdownEffect } from './effects/player-slowdown-effect';
import { createMovePlayerEffect } from './effects/move-player-effect';
import { isPlayerHitsObstacleEvent } from './events/player-hits-obstacle-event';
import { isMovePlayerIntent } from './intents/player-control-intents';
import { GameLogic, IGameDef, IScore } from './types';
import { isGoalScoredEvent } from './events/goal-scored-event';
import { createKickoffEffect } from './effects/kickoff-effect';
import { otherPlayer } from './player-utils';
import { createChangeScoreEffect } from './effects/change-score-effect';



export function createGameLogic({ score }: { score: IScore }): GameLogic {
    return {
        intentResponder: (intent) => {
            if (isMovePlayerIntent(intent)) {
                return createMovePlayerEffect(intent.payload) ;
            }
            throw Error('unknown intent');
        },
        eventResponder: (event) => {
            if (isPlayerHitsObstacleEvent(event)) {
                return createPlayerSlowdownEffect({ player: event.payload.player });
            } else if (isGoalScoredEvent(event)) {
                const other = otherPlayer(event.payload.player);
                return [createChangeScoreEffect(p2s => p2s[other]++), createKickoffEffect(other)];
            }
            throw Error('unknown event');
        }
    };
}
