import { createPlayerSlowdownEffect } from './effects/player-slowdown-effect';
import { createMovePlayerEffect } from './effects/move-player-effect';
import { isPlayerHitsObstacleEvent } from './events/player-hits-obstacle-event';
import { isMovePlayerIntent } from './intents/player-control-intents';
import { GameLogic, IGameDef } from './types';
import { isGoalScoredEvent } from './events/goal-scored-event';
import { createKickoffEffect } from './effects/kickoff-effect';
import { otherPlayer } from './player-utils';
import { createChangeScoreEffect } from './effects/change-score-effect';

const defaultGameLogic: GameLogic = {
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
            return [createKickoffEffect(other)];
        }
        throw Error('unknown event');
    }
};

export function getGameLogic(def: IGameDef) {
    return defaultGameLogic;
}
